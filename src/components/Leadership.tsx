'use client'

import React, { useRef, useState } from 'react'
import { Element } from 'react-scroll'
import { motion, useInView } from 'framer-motion'
import { useSound } from 'use-sound'
import { ReactTyped } from 'react-typed'

import { BiCrown } from 'react-icons/bi'
import { CgCrown } from 'react-icons/cg'
import { SiAmazonaws, SiDocker } from 'react-icons/si'
import { PiHandshakeBold, PiCloudDuotone } from 'react-icons/pi'

const sfx_clunk = '/assets/sound_fx/clunk.mp3'
const sfx_hoverThunk = '/assets/sound_fx/muffled_hover_thunk.mp3'
const sfx_discorda = '/assets/sound_fx/discorda.mp3'

interface props_LeaderCard {
    leaderName: string
    index: number
}

const LeaderCard: React.FC<props_LeaderCard> = ({
    leaderName,
    index,
}) => {
    const [playSfx_clunk] = useSound(sfx_clunk)
    const [playSfx_hoverThunk] = useSound(sfx_hoverThunk)
    const [playSfx_discorda] = useSound(sfx_discorda)

    const [displayQuote, setDisplayQuote] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    return (
        <motion.div
            ref={ref}
            onAnimationStart={() => {
                setIsAnimating(true)
            }}
            onAnimationComplete={() => {
                setIsAnimating(false)
            }}
            onMouseEnter={() => playSfx_hoverThunk()}
            initial={{ opacity: 0, transform: 'perspective(500px) translateZ(55px) translateX(60%)' }}
            animate={
                isInView ? { opacity: 1, transform: 'translateZ(0px) translateX(0%)' } : ''
            }
            transition={{ duration: 1.25, delay: index * 0.15, ease: 'easeOut' }}
            className={`${isAnimating && 'pointer-events-none'} hover:z-20 sm:hover:mx-4 w-[160px] sm:w-[200px] ring-2 ring-green-950 relative group/majorcard hover:rounded-b-none sm:hover:!scale-[115%] transition-all duration-500 select-none rounded-t-xl rounded-b-lg bg-gradient-to-t from-[#040404] via-green-950 to-green-950 shadow-md hover:shadow-2xl shadow-neutral-600 hover:shadow-green-300`}
        >
            <div
                className='relative aspect-square rounded-t-xl overflow-hidden'
                onMouseDown={() => {
                    setDisplayQuote(!displayQuote)
                    playSfx_clunk()
                }}
                onMouseUp={() => playSfx_clunk()}
            >
                <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
                    <p className='text-[#86f446] font-semibold animate-pulse'>Coming Soon</p>
                </div>
                <div className='w-full h-full bg-gradient-to-b from-[#1f3f0d] to-black' />
            </div>

            <div className='rounded-xl p-2 py-3'>
                <h1 className='title-main text-[16px] sm:text-[19px] font-semibold text-center group-hover/majorcard:drop-shadow-[0_0_6px_rgba(255,255,255,0.8)] duration-300 group-hover/majorcard:animate-pulse'>
                    {leaderName}
                </h1>
                <h2 className='text-[13px] sm:text-[15px] font-semibold text-center drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]'>
                    Position Opening Soon
                </h2>
            </div>
        </motion.div>
    )
}

export default function Leadership(): React.ReactNode {
    const positions = [
        "Club President",
        "Vice President",
        "Cloud Infrastructure Lead",
        "DevOps Lead",
        "Community Manager"
    ]

    return (
        <div className='w-full h-full pb-40 text-gray-300 bg-gradient-to-b from-black via-[#031302] to-black'>
            <Element name='leadership' />

            <div className='flex flex-col justify-center items-center w-full h-full py-[44px] px-[10px] sm:px-[7.5vw] lg:px-[14.2vw] gap-4 overflow-x-hidden'>
                <div>
                    <h1 className='title-main w-full text-center text-3xl font-semibold leading-7 drop-shadow-[0_0_14px_rgba(255,255,255,0.5)]'>
                        Our Club Leadership
                    </h1>
                    <h1 className='title-main w-full text-center text-lg font-semibold text-[#FCD690] drop-shadow-[0_0_20px_rgba(255,205,60,0.9)]'>
                        <ReactTyped
                            strings={['Lead With Us']}
                            typeSpeed={40}
                            backSpeed={50}
                            backDelay={1000}
                            loop
                        />
                    </h1>
                </div>

                <div className='w-full text-4xl font-semibold border-b-2 border-[#345222] mb-2 drop-shadow-[0_0_30px_rgba(50,255,50,1)]'></div>

                <div className='flex flex-row flex-wrap justify-center align-middle gap-x-4 sm:gap-x-7 gap-y-[18px] group/majorcards'>
                    {positions.map((position, index) => (
                        <LeaderCard
                            key={index}
                            index={index}
                            leaderName={position}
                        />
                    ))}
                </div>

                <div className='w-full text-4xl font-semibold border-b-2 border-[#345222] drop-shadow-[0_0_30px_rgba(50,255,50,1)]'></div>
            </div>
        </div>
    )
}
