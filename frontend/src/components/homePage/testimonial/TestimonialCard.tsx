import Image from 'next/image'
import React from 'react'

interface ICard {
  imageName: string,
  review: string,
  name: string
}

const TestimonialCard = ({ imageName, review, name }: ICard) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:gap-x-12">
            <div className="relative w-full sm:w-1/4 h-[300px] sm:h-[400px]">
                <Image src={`/testimonial/${imageName}.jpg`} alt="person" fill className="object-cover object-top rounded-2xl" />
                {/* <Image src="/testimonial/quatation.png" alt="person" width={100} height={100} className="absolute top-0 left-0
                -translate-y-1/2"/> */}
            </div>
            <div className="w-full sm:w-2/4 py-3 sm:py-6 flex flex-col justify-center">
                <p className="text-[#07484A] text-xl font-openSans">{review}</p>
                <p className="text-[#07484A] text-xl font-roboto font-medium mt-6">{name}</p>
            </div>
        </div>
    </div>
  )
}

export default TestimonialCard
