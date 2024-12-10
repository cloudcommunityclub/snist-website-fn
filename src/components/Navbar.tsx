'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Link as ScrollLink, animateScroll } from 'react-scroll'
import Link from 'next/link'

import { HiOutlineCloud } from 'react-icons/hi2'
import { GoHome, GoCodeOfConduct } from 'react-icons/go'
import { FaBars, FaTimes } from 'react-icons/fa'
import { FiBook } from 'react-icons/fi'

import { motion } from 'framer-motion'

const logo = '/assets/Designer.png'  

export default function Navbar(): React.ReactNode {
    const [nav, setNav] = useState(false)
    const handleClick = () => setNav(!nav)

    return (
        <div className='z-50 flex flex-col fixed w-full'>
            {/* Top Bar */}
            <motion.div
                className='z-20 flex relative h-[64px] px-4 justify-between items-center text-gray-300 bg-gradient-to-b from-[#000] to-transparent'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
            >
                <Image
                    width={90}
                    height={90}
                    src={logo}
                    alt='C³ Logo'
                    className='z-20 drop-shadow-lg ml-4 rounded-2xl hover:rotate-180 transition-transform duration-300'
                    style={{ width: '48px' }}
                    unoptimized
                />

                {/* Desktop Navigation */}
                <ul className='hidden md:flex text-[15px]'>
                    <li className='text-white font-semibold flex active:scale-90 hover:scale-105 transition duration-300 ease-out'>
                        <GoHome className='my-auto mr-2' />
                        <Link href='/' onClick={() => animateScroll.scrollToTop()}>
                            Home
                        </Link>
                    </li>

                    <li className='text-white font-semibold flex active:scale-90 hover:scale-105 transition duration-300 ease-out'>
                        <HiOutlineCloud className='my-auto mr-2' />
                        <Link href='/projects'>Projects</Link>
                    </li>

                    <li className='text-white font-semibold flex active:scale-90 hover:scale-105 transition duration-300 ease-out'>
                        <FiBook className='my-auto mr-2' />
                        <Link href='/research'>Research</Link>
                    </li>

                    <li className='text-white font-semibold flex active:scale-90 hover:scale-105 transition duration-300 ease-out'>
                        <GoCodeOfConduct className='my-auto mr-2' />
                        <ScrollLink to='recruitment' offset={-120} smooth={true} duration={1500}>Join Us!</ScrollLink>
                    </li>
                </ul>

                {/* Mobile Menu Button */}
                <div onClick={handleClick} className='md:hidden z-10'>
                    {!nav ? <FaBars /> : <FaTimes />}
                </div>

                {/* Mobile Menu */}
                <div
                    className={
                        !nav
                            ? 'hidden'
                            : 'absolute top-0 left-0 w-full h-screen bg-[#0a192f] flex flex-col justify-center items-center'
                    }
                >
                    <div className='flex flex-col gap-4'>
                        <div className='text-2xl text-white font-semibold flex active:scale-90 hover:scale-105 transition duration-300 ease-out'>
                            <GoHome className='my-auto mr-2' />
                            <Link
                                href='/'
                                onClick={() => {
                                    animateScroll.scrollToTop()
                                    handleClick()
                                }}
                            >
                                Home
                            </Link>
                        </div>

                        <div className='text-2xl text-white font-semibold flex active:scale-90 hover:scale-105 transition duration-300 ease-out'>
                            <HiOutlineCloud className='my-auto mr-2' />
                            <Link href='/projects' onClick={handleClick}>
                                Projects
                            </Link>
                        </div>

                        <div className='text-2xl text-white font-semibold flex active:scale-90 hover:scale-105 transition duration-300 ease-out'>
                            <FiBook className='my-auto mr-2' />
                            <Link href='/research' onClick={handleClick}>
                                Research
                            </Link>
                        </div>

                        <div className='text-2xl text-white font-semibold flex active:scale-90 hover:scale-105 transition duration-300 ease-out'>
                            <GoCodeOfConduct className='my-auto mr-2' />
                            <ScrollLink
                                to='recruitment'
                                offset={-120}
                                smooth={true}
                                duration={1500}
                                onClick={handleClick}
                            >
                                Join Us!
                            </ScrollLink>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
