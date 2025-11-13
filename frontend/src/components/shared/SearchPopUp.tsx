import { useRef, useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import api from "../../lib/api";
import Link from "next/link";

interface SearchPopupProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface PrimaryImage {
  id: number;
  alt_text?: string;
  image: string;
}

interface Product {
  id?: number;
  name?: string;
  short_description?: string;
  category_name?: string;
  category_slug?: string;
  availability?: boolean;
  popularity?: number;
  primary_image?: PrimaryImage | string;
}

export default function SearchPopup({ isOpen, setIsOpen }: SearchPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  // Debounce search: wait 500ms after user stops typing
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timer = setTimeout(() => {
      (async () => {
        try {
          const response = await api.get(`/products/search/?q=${encodeURIComponent(q)}`, {
            signal: controller.signal,
          });

          const data = response?.data;
          let items: Product[] = [];
          if (Array.isArray(data)) items = data;
          else if (Array.isArray(data?.results?.data)) items = data.results.data;
          else if (Array.isArray(data?.results)) items = data.results;
          else if (Array.isArray(data?.products)) items = data.products;
          else if (Array.isArray(data?.data)) items = data.data;
          else items = [];

          setResults(items);
        } catch (err) {
          const e = err as { name?: string; message?: string } | undefined;
          if (e?.name === "CanceledError" || e?.name === "AbortError") return;
          console.error("Search error:", err);
          setError("Failed to load results");
          setResults([]);
        } finally {
          setLoading(false);
        }
      })();
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  console.log("Checking result of search",results);

  if (!isOpen) return null;




  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-60 flex items-start justify-center top-30 z-50">
      {/* Popup Box */}
      <div
        ref={popupRef}
        className="bg-white rounded-xl shadow-lg w-[95%] max-w-lg pt-12 px-10 pb-10  relative animate-fadeIn"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close search"
          className="absolute top-2 right-2 text-gray-500 cursor-pointer bg-gray-300 rounded-full p-2 hover:text-red-600"
        >
          <FaTimes size={18} />
        </button>

        {/* Search Bar */}
        <div className="flex items-center gap-2 border border-gray-300 rounded-md p-2 mb-4">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 outline-none text-gray-700"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            aria-label="Search products"
          />
        </div>

        {/* Results Area */}
        <div className="max-h-60 overflow-y-auto border-t pt-3 text-gray-600">
          {loading && (
            <div className="py-6 text-center text-sm text-gray-500">Loading...</div>
          )}

          {error && (
            <div className="py-4 text-center text-sm text-red-500">{error}</div>
          )}

          {!loading && !error && results.length === 0 && query.trim() !== "" && (
            <div className="py-6 text-center text-sm text-gray-500">No results found.</div>
          )}

          {!loading && !error && (results.length > 0 ? (
            <ul className="space-y-3">
                  {results.map((p) => {
                    const name = p.name || "Untitled";
                    let imgSrc: string | undefined;
                    let imgAlt = name;
                    if (!p.primary_image) imgSrc = undefined;
                    else if (typeof p.primary_image === "string") imgSrc = p.primary_image;
                    else {
                      imgSrc = p.primary_image.image;
                      imgAlt = p.primary_image.alt_text || name;
                    }

           
                    return (
                      <li key={String(p.id ?? name)}>
                        <Link
                          href={`/products/${p.id}`}
                          className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            {imgSrc ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={String(imgSrc)} alt={imgAlt} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-800">{name}</div>
                            {p?.short_description && (
                              <div className="text-xs text-gray-500 line-clamp-2">{p?.short_description}</div>
                            )}
                            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                              {p?.category_name && <span>{p?.category_name}</span>}
                              {p?.availability !== undefined && (
                                <span className={`px-2 py-0.5 rounded text-[11px] ${p.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {p.availability ? 'In stock' : 'Out of stock'}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
            </ul>
          ) : (
            // show hint when no query typed yet
            query.trim() === "" && (
              <div className="py-6 text-center text-sm text-gray-500">Type to search products.</div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
