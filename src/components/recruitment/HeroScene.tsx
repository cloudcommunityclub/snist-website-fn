import useSpline from '@splinetool/r3f-spline'
import { OrthographicCamera } from '@react-three/drei'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Scene({ ...props }) {
    const { nodes, materials } = useSpline('https://prod.spline.design/hYRgOh8XmMGipkv9/scene.splinecode')
    const clonesRef = useRef<THREE.Group>(null)
    const [hovered, setHover] = useState(false)

    useFrame((state, delta) => {
        if (clonesRef.current) {
            clonesRef.current.rotation.y += delta * 0.1
            const targetScale = hovered ? 1.75 : 1.05
            // "Blowing up" feel: fast expansion, smoother contraction
            const lerpSpeed = hovered ? 0.2 : 0.1
            clonesRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), lerpSpeed)
        }
    })
    return (
        <>
            {/* <color attach="background" args={['#000000']} /> */}
            <group {...props} dispose={null}>
                <scene name="Scene 1">
                    <mesh
                        name="Сursor"
                        geometry={nodes.Сursor.geometry}
                        material={materials['']}
                        position={[353.08, 85, 13.84]}
                    />
                    <group
                        name="Clones"
                        ref={clonesRef}
                        scale={1.05}
                        onPointerOver={() => setHover(true)}
                        onPointerOut={() => setHover(false)}
                    >
                        <group name="Clone 0" position={[-97, 111.74, 17.27]} rotation={[-Math.PI, -0.18, -2.29]} scale={1}>
                            <group name="Group" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere"
                                    geometry={nodes.Sphere.geometry}
                                    material={materials['Sphere Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 1" position={[-69.06, 129.01, 27.94]} rotation={[-Math.PI, -0.38, -2.09]} scale={1}>
                            <group name="Group1" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere1"
                                    geometry={nodes.Sphere1.geometry}
                                    material={materials['Sphere1 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 2" position={[-78.32, 126.72, 0]} rotation={[-Math.PI, 0, -2.12]}>
                            <group name="Group2" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere2"
                                    geometry={nodes.Sphere2.geometry}
                                    material={materials['Sphere2 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 3" position={[-87.06, 110.36, 49.35]} rotation={[-Math.PI, -0.53, -2.31]} scale={1}>
                            <group name="Group3" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere3"
                                    geometry={nodes.Sphere3.geometry}
                                    material={materials['Sphere3 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 4" position={[-113.96, 88.71, 36.55]} rotation={[-Math.PI, -0.31, -2.5]} scale={1}>
                            <group name="Group4" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere4"
                                    geometry={nodes.Sphere4.geometry}
                                    material={materials['Sphere4 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 5" position={[-102.03, 82.54, 70.5]} rotation={[-Math.PI, -0.61, -2.55]} scale={1}>
                            <group name="Group5" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere5"
                                    geometry={nodes.Sphere5.geometry}
                                    material={materials['Sphere5 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 6" position={[-125.26, 59.14, 54.82]} rotation={[-Math.PI, -0.41, -2.73]} scale={1}>
                            <group name="Group6" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere6"
                                    geometry={nodes.Sphere6.geometry}
                                    material={materials['Sphere6 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 7" position={[-110.36, 49.35, 87.06]} rotation={[-Math.PI, -0.67, -2.79]}>
                            <group name="Group7" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere7"
                                    geometry={nodes.Sphere7.geometry}
                                    material={materials['Sphere7 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 8" position={[-129.01, 27.94, 69.06]} rotation={[-Math.PI, -0.49, -2.95]}>
                            <group name="Group8" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere8"
                                    geometry={nodes.Sphere8.geometry}
                                    material={materials['Sphere8 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 9" position={[-111.74, 17.27, 97]} rotation={[-Math.PI, -0.72, -3.02]} scale={1}>
                            <group name="Group9" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere9"
                                    geometry={nodes.Sphere9.geometry}
                                    material={materials['Sphere9 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 10" position={[-126.72, 0, 78.32]} rotation={[-Math.PI, -0.55, -Math.PI]} scale={1}>
                            <group name="Group10" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere10"
                                    geometry={nodes.Sphere10.geometry}
                                    material={materials['Sphere10 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 11" position={[-54.82, 125.26, 59.14]} rotation={[-Math.PI, -0.82, -2.14]} scale={1}>
                            <group name="Group11" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere11"
                                    geometry={nodes.Sphere11.geometry}
                                    material={materials['Sphere11 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 12" position={[-70.5, 102.03, 82.54]} rotation={[-Math.PI, -0.86, -2.39]} scale={1}>
                            <group name="Group12" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere12"
                                    geometry={nodes.Sphere12.geometry}
                                    material={materials['Sphere12 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 13" position={[-82.54, 70.5, 102.03]} rotation={[-Math.PI, -0.89, -2.64]} scale={1}>
                            <group name="Group13" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere13"
                                    geometry={nodes.Sphere13.geometry}
                                    material={materials['Sphere13 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 14" position={[-88.71, 36.55, 113.96]} rotation={[-Math.PI, -0.91, -2.89]} scale={1}>
                            <group name="Group14" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere14"
                                    geometry={nodes.Sphere14.geometry}
                                    material={materials['Sphere14 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 15" position={[-36.55, 113.96, 88.71]} rotation={[Math.PI, -1.18, -2.27]} scale={1}>
                            <group name="Group15" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere15"
                                    geometry={nodes.Sphere15.geometry}
                                    material={materials['Sphere15 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 16" position={[-49.35, 87.06, 110.36]} rotation={[-Math.PI, -1.14, -2.51]} scale={1}>
                            <group name="Group16" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere16"
                                    geometry={nodes.Sphere16.geometry}
                                    material={materials['Sphere16 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 17" position={[-59.14, 54.82, 125.26]} rotation={[-Math.PI, -1.13, -2.76]} scale={1}>
                            <group name="Group17" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere17"
                                    geometry={nodes.Sphere17.geometry}
                                    material={materials['Sphere17 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 18" position={[-17.27, 97, 111.74]} rotation={[-Math.PI, -1.42, -2.43]} scale={1}>
                            <group name="Group18" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere18"
                                    geometry={nodes.Sphere18.geometry}
                                    material={materials['Sphere18 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 19" position={[-27.94, 69.06, 129.01]} rotation={[Math.PI, -1.36, -2.66]} scale={1}>
                            <group name="Group19" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere19"
                                    geometry={nodes.Sphere19.geometry}
                                    material={materials['Sphere19 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 20" position={[0, 78.32, 126.72]} rotation={[-0.55, -Math.PI / 2, 0]} scale={1}>
                            <group name="Group20" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere20"
                                    geometry={nodes.Sphere20.geometry}
                                    material={materials['Sphere20 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 21" position={[-51.8, 139.68, 0]} rotation={[-Math.PI, 0, -1.92]} scale={1}>
                            <group name="Group21" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere21"
                                    geometry={nodes.Sphere21.geometry}
                                    material={materials['Sphere21 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 22" position={[-37.7, 140.86, 30.5]} rotation={[-Math.PI, -0.71, -1.9]}>
                            <group name="Group22" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere22"
                                    geometry={nodes.Sphere22.geometry}
                                    material={materials['Sphere22 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 23" position={[-19.49, 133.56, 63.06]} rotation={[Math.PI, -1.28, -2.02]} scale={1}>
                            <group name="Group23" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere23"
                                    geometry={nodes.Sphere23.geometry}
                                    material={materials['Sphere23 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 24" position={[0, 117.56, 91.51]} rotation={[-0.92, -Math.PI / 2, 0]} scale={1}>
                            <group name="Group24" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere24"
                                    geometry={nodes.Sphere24.geometry}
                                    material={materials['Sphere24 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 25" position={[17.27, 97, 111.74]} rotation={[0, -1.42, 0.71]}>
                            <group name="Group25" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere25"
                                    geometry={nodes.Sphere25.geometry}
                                    material={materials['Sphere25 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 26" position={[-18.27, 147.85, 0]} rotation={[-Math.PI, 0, -1.69]} scale={1}>
                            <group name="Group26" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere26"
                                    geometry={nodes.Sphere26.geometry}
                                    material={materials['Sphere26 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 27" position={[0, 145.6, 31.53]} rotation={[-1.35, -Math.PI / 2, 0]}>
                            <group name="Group27" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere27"
                                    geometry={nodes.Sphere27.geometry}
                                    material={materials['Sphere27 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 28" position={[19.49, 133.56, 63.06]} rotation={[0, -1.28, 1.12]} scale={1}>
                            <group name="Group28" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere28"
                                    geometry={nodes.Sphere28.geometry}
                                    material={materials['Sphere28 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 29" position={[36.55, 113.96, 88.71]} rotation={[0, -1.18, 0.88]} scale={1}>
                            <group name="Group29" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere29"
                                    geometry={nodes.Sphere29.geometry}
                                    material={materials['Sphere29 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 30" position={[18.27, 147.85, 0]} rotation={[0, 0, 1.45]}>
                            <group name="Group30" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere30"
                                    geometry={nodes.Sphere30.geometry}
                                    material={materials['Sphere30 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 31" position={[37.7, 140.86, 30.5]} rotation={[0, -0.71, 1.24]} scale={1}>
                            <group name="Group31" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere31"
                                    geometry={nodes.Sphere31.geometry}
                                    material={materials['Sphere31 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 32" position={[54.82, 125.26, 59.14]} rotation={[0, -0.82, 1]} scale={1}>
                            <group name="Group32" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere32"
                                    geometry={nodes.Sphere32.geometry}
                                    material={materials['Sphere32 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 33" position={[51.8, 139.68, 0]} rotation={[0, 0, 1.22]}>
                            <group name="Group33" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere33"
                                    geometry={nodes.Sphere33.geometry}
                                    material={materials['Sphere33 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 34" position={[69.06, 129.01, 27.94]} rotation={[0, -0.38, 1.05]} scale={1}>
                            <group name="Group34" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere34"
                                    geometry={nodes.Sphere34.geometry}
                                    material={materials['Sphere34 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 35" position={[78.32, 126.72, 0]} rotation={[0, 0, 1.02]}>
                            <group name="Group35" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere35"
                                    geometry={nodes.Sphere35.geometry}
                                    material={materials['Sphere35 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 36" position={[-69.06, 129.01, -27.94]} rotation={[-Math.PI, 0.38, -2.09]} scale={1}>
                            <group name="Group36" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere36"
                                    geometry={nodes.Sphere36.geometry}
                                    material={materials['Sphere36 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 37" position={[-37.7, 140.86, -30.5]} rotation={[-Math.PI, 0.71, -1.9]}>
                            <group name="Group37" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere37"
                                    geometry={nodes.Sphere37.geometry}
                                    material={materials['Sphere37 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 38" position={[0, 145.6, -31.53]} rotation={[1.35, Math.PI / 2, 0]}>
                            <group name="Group38" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere38"
                                    geometry={nodes.Sphere38.geometry}
                                    material={materials['Sphere38 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 39" position={[37.7, 140.86, -30.5]} rotation={[0, 0.71, 1.24]}>
                            <group name="Group39" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere39"
                                    geometry={nodes.Sphere39.geometry}
                                    material={materials['Sphere39 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 40" position={[69.06, 129.01, -27.94]} rotation={[0, 0.38, 1.05]} scale={1}>
                            <group name="Group40" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere40"
                                    geometry={nodes.Sphere40.geometry}
                                    material={materials['Sphere40 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 41" position={[-54.82, 125.26, -59.14]} rotation={[-Math.PI, 0.82, -2.14]} scale={1}>
                            <group name="Group41" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere41"
                                    geometry={nodes.Sphere41.geometry}
                                    material={materials['Sphere41 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 42" position={[-19.49, 133.56, -63.06]} rotation={[-Math.PI, 1.28, -2.02]} scale={1}>
                            <group name="Group42" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere42"
                                    geometry={nodes.Sphere42.geometry}
                                    material={materials['Sphere42 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 43" position={[19.49, 133.56, -63.06]} rotation={[0, 1.28, 1.12]} scale={1}>
                            <group name="Group43" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere43"
                                    geometry={nodes.Sphere43.geometry}
                                    material={materials['Sphere43 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 44" position={[54.82, 125.26, -59.14]} rotation={[0, 0.82, 1]} scale={1}>
                            <group name="Group44" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere44"
                                    geometry={nodes.Sphere44.geometry}
                                    material={materials['Sphere44 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 45" position={[-36.55, 113.96, -88.71]} rotation={[-Math.PI, 1.18, -2.27]} scale={1}>
                            <group name="Group45" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere45"
                                    geometry={nodes.Sphere45.geometry}
                                    material={materials['Sphere45 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 46" position={[0, 117.56, -91.51]} rotation={[0.92, Math.PI / 2, 0]} scale={1}>
                            <group name="Group46" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere46"
                                    geometry={nodes.Sphere46.geometry}
                                    material={materials['Sphere46 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 47" position={[36.55, 113.96, -88.71]} rotation={[0, 1.18, 0.88]} scale={1}>
                            <group name="Group47" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere47"
                                    geometry={nodes.Sphere47.geometry}
                                    material={materials['Sphere47 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 48" position={[-17.27, 97, -111.74]} rotation={[-Math.PI, 1.42, -2.43]}>
                            <group name="Group48" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere48"
                                    geometry={nodes.Sphere48.geometry}
                                    material={materials['Sphere48 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 49" position={[17.27, 97, -111.74]} rotation={[0, 1.42, 0.71]}>
                            <group name="Group49" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere49"
                                    geometry={nodes.Sphere49.geometry}
                                    material={materials['Sphere49 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 50" position={[0, 78.32, -126.72]} rotation={[0.55, Math.PI / 2, 0]} scale={1}>
                            <group name="Group50" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere50"
                                    geometry={nodes.Sphere50.geometry}
                                    material={materials['Sphere50 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 51" position={[-97, 111.74, -17.27]} rotation={[-Math.PI, 0.18, -2.29]} scale={1}>
                            <group name="Group51" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere51"
                                    geometry={nodes.Sphere51.geometry}
                                    material={materials['Sphere51 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 52" position={[-87.06, 110.36, -49.35]} rotation={[-Math.PI, 0.53, -2.31]} scale={1}>
                            <group name="Group52" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere52"
                                    geometry={nodes.Sphere52.geometry}
                                    material={materials['Sphere52 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 53" position={[-70.5, 102.03, -82.54]} rotation={[-Math.PI, 0.86, -2.39]} scale={1}>
                            <group name="Group53" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere53"
                                    geometry={nodes.Sphere53.geometry}
                                    material={materials['Sphere53 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 54" position={[-49.35, 87.06, -110.36]} rotation={[-Math.PI, 1.14, -2.51]} scale={1}>
                            <group name="Group54" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere54"
                                    geometry={nodes.Sphere54.geometry}
                                    material={materials['Sphere54 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 55" position={[-27.94, 69.06, -129.01]} rotation={[-Math.PI, 1.36, -2.66]} scale={1}>
                            <group name="Group55" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere55"
                                    geometry={nodes.Sphere55.geometry}
                                    material={materials['Sphere55 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 56" position={[-113.96, 88.71, -36.55]} rotation={[-Math.PI, 0.31, -2.5]} scale={1}>
                            <group name="Group56" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere56"
                                    geometry={nodes.Sphere56.geometry}
                                    material={materials['Sphere56 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 57" position={[-102.03, 82.54, -70.5]} rotation={[-Math.PI, 0.61, -2.55]} scale={1}>
                            <group name="Group57" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere57"
                                    geometry={nodes.Sphere57.geometry}
                                    material={materials['Sphere57 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 58" position={[-82.54, 70.5, -102.03]} rotation={[-Math.PI, 0.89, -2.64]} scale={1}>
                            <group name="Group58" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere58"
                                    geometry={nodes.Sphere58.geometry}
                                    material={materials['Sphere58 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 59" position={[-59.14, 54.82, -125.26]} rotation={[-Math.PI, 1.13, -2.76]}>
                            <group name="Group59" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere59"
                                    geometry={nodes.Sphere59.geometry}
                                    material={materials['Sphere59 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 60" position={[-125.26, 59.14, -54.82]} rotation={[-Math.PI, 0.41, -2.73]} scale={1}>
                            <group name="Group60" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere60"
                                    geometry={nodes.Sphere60.geometry}
                                    material={materials['Sphere60 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 61" position={[-110.36, 49.35, -87.06]} rotation={[-Math.PI, 0.67, -2.79]} scale={1}>
                            <group name="Group61" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere61"
                                    geometry={nodes.Sphere61.geometry}
                                    material={materials['Sphere61 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 62" position={[-88.71, 36.55, -113.96]} rotation={[-Math.PI, 0.91, -2.89]}>
                            <group name="Group62" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere62"
                                    geometry={nodes.Sphere62.geometry}
                                    material={materials['Sphere62 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 63" position={[-129.01, 27.94, -69.06]} rotation={[-Math.PI, 0.49, -2.95]}>
                            <group name="Group63" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere63"
                                    geometry={nodes.Sphere63.geometry}
                                    material={materials['Sphere63 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 64" position={[-111.74, 17.27, -97]} rotation={[-Math.PI, 0.72, -3.02]} scale={1}>
                            <group name="Group64" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere64"
                                    geometry={nodes.Sphere64.geometry}
                                    material={materials['Sphere64 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 65" position={[-126.72, 0, -78.32]} rotation={[-Math.PI, 0.55, -Math.PI]} scale={1}>
                            <group name="Group65" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere65"
                                    geometry={nodes.Sphere65.geometry}
                                    material={materials['Sphere65 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 66" position={[-117.56, 91.51, 0]} rotation={[-Math.PI, 0, -2.48]}>
                            <group name="Group66" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere66"
                                    geometry={nodes.Sphere66.geometry}
                                    material={materials['Sphere66 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 67" position={[-133.56, 63.06, -19.49]} rotation={[-Math.PI, 0.14, -2.7]} scale={1}>
                            <group name="Group67" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere67"
                                    geometry={nodes.Sphere67.geometry}
                                    material={materials['Sphere67 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 68" position={[-140.86, 30.5, -37.7]} rotation={[-Math.PI, 0.25, -2.93]} scale={1}>
                            <group name="Group68" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere68"
                                    geometry={nodes.Sphere68.geometry}
                                    material={materials['Sphere68 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 69" position={[-139.68, 0, -51.8]} rotation={[-Math.PI, 0.35, -Math.PI]}>
                            <group name="Group69" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere69"
                                    geometry={nodes.Sphere69.geometry}
                                    material={materials['Sphere69 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 70" position={[-133.56, 63.06, 19.49]} rotation={[-Math.PI, -0.14, -2.7]} scale={1}>
                            <group name="Group70" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere70"
                                    geometry={nodes.Sphere70.geometry}
                                    material={materials['Sphere70 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 71" position={[-145.6, 31.53, 0]} rotation={[-Math.PI, 0, -2.92]} scale={1}>
                            <group name="Group71" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere71"
                                    geometry={nodes.Sphere71.geometry}
                                    material={materials['Sphere71 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 72" position={[-147.85, 0, -18.27]} rotation={[-Math.PI, 0.12, -Math.PI]} scale={1}>
                            <group name="Group72" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere72"
                                    geometry={nodes.Sphere72.geometry}
                                    material={materials['Sphere72 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 73" position={[-140.86, 30.5, 37.7]} rotation={[-Math.PI, -0.25, -2.93]} scale={1}>
                            <group name="Group73" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere73"
                                    geometry={nodes.Sphere73.geometry}
                                    material={materials['Sphere73 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 74" position={[-147.85, 0, 18.27]} rotation={[-Math.PI, -0.12, Math.PI]} scale={1}>
                            <group name="Group74" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere74"
                                    geometry={nodes.Sphere74.geometry}
                                    material={materials['Sphere74 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 75" position={[-139.68, 0, 51.8]} rotation={[-Math.PI, -0.35, Math.PI]}>
                            <group name="Group75" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere75"
                                    geometry={nodes.Sphere75.geometry}
                                    material={materials['Sphere75 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 76" position={[97, 111.74, 17.27]} rotation={[0, -0.18, 0.85]} scale={1}>
                            <group name="Group76" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere76"
                                    geometry={nodes.Sphere76.geometry}
                                    material={materials['Sphere76 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 77" position={[87.06, 110.36, 49.35]} rotation={[0, -0.53, 0.83]}>
                            <group name="Group77" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere77"
                                    geometry={nodes.Sphere77.geometry}
                                    material={materials['Sphere77 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 78" position={[70.5, 102.03, 82.54]} rotation={[0, -0.86, 0.76]}>
                            <group name="Group78" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere78"
                                    geometry={nodes.Sphere78.geometry}
                                    material={materials['Sphere78 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 79" position={[49.35, 87.06, 110.36]} rotation={[0, -1.14, 0.63]} scale={1}>
                            <group name="Group79" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere79"
                                    geometry={nodes.Sphere79.geometry}
                                    material={materials['Sphere79 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 80" position={[27.94, 69.06, 129.01]} rotation={[0, -1.36, 0.49]} scale={1}>
                            <group name="Group80" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere80"
                                    geometry={nodes.Sphere80.geometry}
                                    material={materials['Sphere80 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone" position={[134.51, 63.43, -16.95]} rotation={[0, -0.31, 0.64]} scale={1}>
                            <group name="Group81" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere81"
                                    geometry={nodes.Sphere81.geometry}
                                    material={materials['Sphere81 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone1" position={[118.73, 88.13, 0.31]} rotation={[0, -0.31, 0.64]} scale={1}>
                            <group name="Group82" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere82"
                                    geometry={nodes.Sphere82.geometry}
                                    material={materials['Sphere82 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 81" position={[113.96, 88.71, 36.55]} rotation={[0, -0.31, 0.64]} scale={1}>
                            <group name="Group83" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere83"
                                    geometry={nodes.Sphere83.geometry}
                                    material={materials['Sphere83 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 82" position={[102.03, 82.54, 70.5]} rotation={[0, -0.61, 0.59]} scale={1}>
                            <group name="Group84" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere84"
                                    geometry={nodes.Sphere84.geometry}
                                    material={materials['Sphere84 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 83" position={[82.54, 70.5, 102.03]} rotation={[0, -0.89, 0.5]}>
                            <group name="Group85" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere85"
                                    geometry={nodes.Sphere85.geometry}
                                    material={materials['Sphere85 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 84" position={[59.14, 54.82, 125.26]} rotation={[0, -1.13, 0.38]}>
                            <group name="Group86" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere86"
                                    geometry={nodes.Sphere86.geometry}
                                    material={materials['Sphere86 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 85" position={[125.26, 59.14, 54.82]} rotation={[0, -0.41, 0.41]} scale={1}>
                            <group name="Group87" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere87"
                                    geometry={nodes.Sphere87.geometry}
                                    material={materials['Sphere87 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 86" position={[110.36, 49.35, 87.06]} rotation={[0, -0.67, 0.35]} scale={1}>
                            <group name="Group88" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere88"
                                    geometry={nodes.Sphere88.geometry}
                                    material={materials['Sphere88 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 87" position={[88.71, 36.55, 113.96]} rotation={[0, -0.91, 0.25]} scale={1}>
                            <group name="Group89" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere89"
                                    geometry={nodes.Sphere89.geometry}
                                    material={materials['Sphere89 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 88" position={[129.01, 27.94, 69.06]} rotation={[0, -0.49, 0.19]}>
                            <group name="Group90" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere90"
                                    geometry={nodes.Sphere90.geometry}
                                    material={materials['Sphere90 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 89" position={[111.74, 17.27, 97]} rotation={[0, -0.72, 0.12]}>
                            <group name="Group91" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere91"
                                    geometry={nodes.Sphere91.geometry}
                                    material={materials['Sphere91 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 90" position={[126.72, 0, 78.32]} rotation={[0, -0.55, 0]}>
                            <group name="Group92" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere92"
                                    geometry={nodes.Sphere92.geometry}
                                    material={materials['Sphere92 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 91" position={[0, 51.8, 139.68]} rotation={[-0.35, -Math.PI / 2, 0]} scale={1}>
                            <group name="Group93" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere93"
                                    geometry={nodes.Sphere93.geometry}
                                    material={materials['Sphere93 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 92" position={[-30.5, 37.7, 140.86]} rotation={[Math.PI, -1.35, -2.89]} scale={1}>
                            <group name="Group94" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere94"
                                    geometry={nodes.Sphere94.geometry}
                                    material={materials['Sphere94 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 93" position={[-63.06, 19.49, 133.56]} rotation={[-Math.PI, -1.13, -3.01]} scale={1}>
                            <group name="Group95" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere95"
                                    geometry={nodes.Sphere95.geometry}
                                    material={materials['Sphere95 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 94" position={[-91.51, 0, 117.56]} rotation={[-Math.PI, -0.92, Math.PI]}>
                            <group name="Group96" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere96"
                                    geometry={nodes.Sphere96.geometry}
                                    material={materials['Sphere96 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 95" position={[-111.74, -17.27, 97]} rotation={[-Math.PI, -0.72, 3.02]} scale={1}>
                            <group name="Group97" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere97"
                                    geometry={nodes.Sphere97.geometry}
                                    material={materials['Sphere97 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 96" position={[0, 18.27, 147.85]} rotation={[-0.12, -Math.PI / 2, 0]} scale={1}>
                            <group name="Group98" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere98"
                                    geometry={nodes.Sphere98.geometry}
                                    material={materials['Sphere98 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 97" position={[-31.53, 0, 145.6]} rotation={[-Math.PI, -1.35, -Math.PI]}>
                            <group name="Group99" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere99"
                                    geometry={nodes.Sphere99.geometry}
                                    material={materials['Sphere99 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 98" position={[-63.06, -19.49, 133.56]} rotation={[-Math.PI, -1.13, 3.01]} scale={1}>
                            <group name="Group100" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere100"
                                    geometry={nodes.Sphere100.geometry}
                                    material={materials['Sphere100 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 99" position={[-88.71, -36.55, 113.96]} rotation={[-Math.PI, -0.91, 2.89]}>
                            <group name="Group101" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere101"
                                    geometry={nodes.Sphere101.geometry}
                                    material={materials['Sphere101 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 100" position={[0, -18.27, 147.85]} rotation={[0.12, -Math.PI / 2, 0]} scale={1}>
                            <group name="Group102" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere102"
                                    geometry={nodes.Sphere102.geometry}
                                    material={materials['Sphere102 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 101" position={[-30.5, -37.7, 140.86]} rotation={[-Math.PI, -1.35, 2.89]} scale={1}>
                            <group name="Group103" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere103"
                                    geometry={nodes.Sphere103.geometry}
                                    material={materials['Sphere103 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 102" position={[-59.14, -54.82, 125.26]} rotation={[-Math.PI, -1.13, 2.76]} scale={1}>
                            <group name="Group104" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere104"
                                    geometry={nodes.Sphere104.geometry}
                                    material={materials['Sphere104 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 103" position={[0, -51.8, 139.68]} rotation={[0.35, -Math.PI / 2, 0]} scale={1}>
                            <group name="Group105" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere105"
                                    geometry={nodes.Sphere105.geometry}
                                    material={materials['Sphere105 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 104" position={[-27.94, -69.06, 129.01]} rotation={[-Math.PI, -1.36, 2.66]} scale={1}>
                            <group name="Group106" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere106"
                                    geometry={nodes.Sphere106.geometry}
                                    material={materials['Sphere106 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 105" position={[0, -78.32, 126.72]} rotation={[0.55, -Math.PI / 2, 0]} scale={1}>
                            <group name="Group107" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere107"
                                    geometry={nodes.Sphere107.geometry}
                                    material={materials['Sphere107 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 106" position={[-129.01, -27.94, 69.06]} rotation={[-Math.PI, -0.49, 2.95]}>
                            <group name="Group108" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere108"
                                    geometry={nodes.Sphere108.geometry}
                                    material={materials['Sphere108 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 107" position={[-140.86, -30.5, 37.7]} rotation={[-Math.PI, -0.25, 2.93]} scale={1}>
                            <group name="Group109" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere109"
                                    geometry={nodes.Sphere109.geometry}
                                    material={materials['Sphere109 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 108" position={[-145.6, -31.53, 0]} rotation={[-Math.PI, 0, 2.92]} scale={1}>
                            <group name="Group110" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere110"
                                    geometry={nodes.Sphere110.geometry}
                                    material={materials['Sphere110 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 109" position={[-140.86, -30.5, -37.7]} rotation={[-Math.PI, 0.25, 2.93]} scale={1}>
                            <group name="Group111" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere111"
                                    geometry={nodes.Sphere111.geometry}
                                    material={materials['Sphere111 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 110" position={[-129.01, -27.94, -69.06]} rotation={[-Math.PI, 0.49, 2.95]}>
                            <group name="Group112" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere112"
                                    geometry={nodes.Sphere112.geometry}
                                    material={materials['Sphere112 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 111" position={[-125.26, -59.14, 54.82]} rotation={[-Math.PI, -0.41, 2.73]} scale={1}>
                            <group name="Group113" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere113"
                                    geometry={nodes.Sphere113.geometry}
                                    material={materials['Sphere113 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 112" position={[-133.56, -63.06, 19.49]} rotation={[-Math.PI, -0.14, 2.7]} scale={1}>
                            <group name="Group114" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere114"
                                    geometry={nodes.Sphere114.geometry}
                                    material={materials['Sphere114 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 113" position={[-133.56, -63.06, -19.49]} rotation={[-Math.PI, 0.14, 2.7]} scale={1}>
                            <group name="Group115" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere115"
                                    geometry={nodes.Sphere115.geometry}
                                    material={materials['Sphere115 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 114" position={[-125.26, -59.14, -54.82]} rotation={[-Math.PI, 0.41, 2.73]} scale={1}>
                            <group name="Group116" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere116"
                                    geometry={nodes.Sphere116.geometry}
                                    material={materials['Sphere116 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 115" position={[-113.96, -88.71, 36.55]} rotation={[-Math.PI, -0.31, 2.5]} scale={1}>
                            <group name="Group117" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere117"
                                    geometry={nodes.Sphere117.geometry}
                                    material={materials['Sphere117 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 116" position={[-117.56, -91.51, 0]} rotation={[-Math.PI, 0, 2.48]}>
                            <group name="Group118" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere118"
                                    geometry={nodes.Sphere118.geometry}
                                    material={materials['Sphere118 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 117" position={[-113.96, -88.71, -36.55]} rotation={[-Math.PI, 0.31, 2.5]} scale={1}>
                            <group name="Group119" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere119"
                                    geometry={nodes.Sphere119.geometry}
                                    material={materials['Sphere119 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 118" position={[-97, -111.74, 17.27]} rotation={[-Math.PI, -0.18, 2.29]} scale={1}>
                            <group name="Group120" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere120"
                                    geometry={nodes.Sphere120.geometry}
                                    material={materials['Sphere120 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 119" position={[-97, -111.74, -17.27]} rotation={[-Math.PI, 0.18, 2.29]} scale={1}>
                            <group name="Group121" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere121"
                                    geometry={nodes.Sphere121.geometry}
                                    material={materials['Sphere121 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 120" position={[-78.32, -126.72, 0]} rotation={[-Math.PI, 0, 2.12]}>
                            <group name="Group122" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere122"
                                    geometry={nodes.Sphere122.geometry}
                                    material={materials['Sphere122 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 121" position={[-111.74, -17.27, -97]} rotation={[-Math.PI, 0.72, 3.02]} scale={1}>
                            <group name="Group123" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere123"
                                    geometry={nodes.Sphere123.geometry}
                                    material={materials['Sphere123 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 122" position={[-91.51, 0, -117.56]} rotation={[-Math.PI, 0.92, -Math.PI]} scale={1}>
                            <group name="Group124" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere124"
                                    geometry={nodes.Sphere124.geometry}
                                    material={materials['Sphere124 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 123" position={[-63.06, 19.49, -133.56]} rotation={[-Math.PI, 1.13, -3.01]} scale={1}>
                            <group name="Group125" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere125"
                                    geometry={nodes.Sphere125.geometry}
                                    material={materials['Sphere125 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 124" position={[-30.5, 37.7, -140.86]} rotation={[-Math.PI, 1.35, -2.89]} scale={1}>
                            <group name="Group126" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere126"
                                    geometry={nodes.Sphere126.geometry}
                                    material={materials['Sphere126 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 125" position={[0, 51.8, -139.68]} rotation={[0.35, Math.PI / 2, 0]} scale={1}>
                            <group name="Group127" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere127"
                                    geometry={nodes.Sphere127.geometry}
                                    material={materials['Sphere127 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 126" position={[-88.71, -36.55, -113.96]} rotation={[-Math.PI, 0.91, 2.89]} scale={1}>
                            <group name="Group128" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere128"
                                    geometry={nodes.Sphere128.geometry}
                                    material={materials['Sphere128 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 127" position={[-63.06, -19.49, -133.56]} rotation={[-Math.PI, 1.13, 3.01]} scale={1}>
                            <group name="Group129" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere129"
                                    geometry={nodes.Sphere129.geometry}
                                    material={materials['Sphere129 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 128" position={[-31.53, 0, -145.6]} rotation={[-Math.PI, 1.35, Math.PI]}>
                            <group name="Group130" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere130"
                                    geometry={nodes.Sphere130.geometry}
                                    material={materials['Sphere130 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 129" position={[0, 18.27, -147.85]} rotation={[0.12, Math.PI / 2, 0]} scale={1}>
                            <group name="Group131" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere131"
                                    geometry={nodes.Sphere131.geometry}
                                    material={materials['Sphere131 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 130" position={[-59.14, -54.82, -125.26]} rotation={[-Math.PI, 1.13, 2.76]} scale={1}>
                            <group name="Group132" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere132"
                                    geometry={nodes.Sphere132.geometry}
                                    material={materials['Sphere132 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 131" position={[-30.5, -37.7, -140.86]} rotation={[Math.PI, 1.35, 2.89]} scale={1}>
                            <group name="Group133" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere133"
                                    geometry={nodes.Sphere133.geometry}
                                    material={materials['Sphere133 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 132" position={[0, -18.27, -147.85]} rotation={[-0.12, Math.PI / 2, 0]} scale={1}>
                            <group name="Group134" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere134"
                                    geometry={nodes.Sphere134.geometry}
                                    material={materials['Sphere134 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 133" position={[-27.94, -69.06, -129.01]} rotation={[Math.PI, 1.36, 2.66]} scale={1}>
                            <group name="Group135" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere135"
                                    geometry={nodes.Sphere135.geometry}
                                    material={materials['Sphere135 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 134" position={[0, -51.8, -139.68]} rotation={[-0.35, Math.PI / 2, 0]}>
                            <group name="Group136" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere136"
                                    geometry={nodes.Sphere136.geometry}
                                    material={materials['Sphere136 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 135" position={[0, -78.32, -126.72]} rotation={[-0.55, Math.PI / 2, 0]} scale={1}>
                            <group name="Group137" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere137"
                                    geometry={nodes.Sphere137.geometry}
                                    material={materials['Sphere137 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 136" position={[27.94, 69.06, -129.01]} rotation={[0, 1.36, 0.49]} scale={1}>
                            <group name="Group138" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere138"
                                    geometry={nodes.Sphere138.geometry}
                                    material={materials['Sphere138 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 137" position={[49.35, 87.06, -110.36]} rotation={[0, 1.14, 0.63]} scale={1}>
                            <group name="Group139" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere139"
                                    geometry={nodes.Sphere139.geometry}
                                    material={materials['Sphere139 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 138" position={[70.5, 102.03, -82.54]} rotation={[0, 0.86, 0.76]}>
                            <group name="Group140" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere140"
                                    geometry={nodes.Sphere140.geometry}
                                    material={materials['Sphere140 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 139" position={[87.06, 110.36, -49.35]} rotation={[0, 0.53, 0.83]}>
                            <group name="Group141" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere141"
                                    geometry={nodes.Sphere141.geometry}
                                    material={materials['Sphere141 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 140" position={[97, 111.74, -17.27]} rotation={[0, 0.18, 0.85]} scale={1}>
                            <group name="Group142" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere142"
                                    geometry={nodes.Sphere142.geometry}
                                    material={materials['Sphere142 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 141" position={[59.14, 54.82, -125.26]} rotation={[0, 1.13, 0.38]} scale={1}>
                            <group name="Group143" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere143"
                                    geometry={nodes.Sphere143.geometry}
                                    material={materials['Sphere143 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 142" position={[82.54, 70.5, -102.03]} rotation={[0, 0.89, 0.5]}>
                            <group name="Group144" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere144"
                                    geometry={nodes.Sphere144.geometry}
                                    material={materials['Sphere144 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 143" position={[102.03, 82.54, -70.5]} rotation={[0, 0.61, 0.59]}>
                            <group name="Group145" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere145"
                                    geometry={nodes.Sphere145.geometry}
                                    material={materials['Sphere145 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 144" position={[113.96, 88.71, -36.55]} rotation={[0, 0.31, 0.64]} scale={1}>
                            <group name="Group146" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere146"
                                    geometry={nodes.Sphere146.geometry}
                                    material={materials['Sphere146 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 145" position={[88.71, 36.55, -113.96]} rotation={[0, 0.91, 0.25]} scale={1}>
                            <group name="Group147" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere147"
                                    geometry={nodes.Sphere147.geometry}
                                    material={materials['Sphere147 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 146" position={[110.36, 49.35, -87.06]} rotation={[0, 0.67, 0.35]} scale={1}>
                            <group name="Group148" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere148"
                                    geometry={nodes.Sphere148.geometry}
                                    material={materials['Sphere148 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 147" position={[125.26, 59.14, -54.82]} rotation={[0, 0.41, 0.41]} scale={1}>
                            <group name="Group149" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere149"
                                    geometry={nodes.Sphere149.geometry}
                                    material={materials['Sphere149 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 148" position={[111.74, 17.27, -97]} rotation={[0, 0.72, 0.12]}>
                            <group name="Group150" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere150"
                                    geometry={nodes.Sphere150.geometry}
                                    material={materials['Sphere150 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 149" position={[129.01, 27.94, -69.06]} rotation={[0, 0.49, 0.19]}>
                            <group name="Group151" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere151"
                                    geometry={nodes.Sphere151.geometry}
                                    material={materials['Sphere151 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 150" position={[126.72, 0, -78.32]} rotation={[0, 0.55, 0]}>
                            <group name="Group152" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere152"
                                    geometry={nodes.Sphere152.geometry}
                                    material={materials['Sphere152 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 151" position={[97, -111.74, 17.27]} rotation={[0, -0.18, -0.85]} scale={1}>
                            <group name="Group153" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere153"
                                    geometry={nodes.Sphere153.geometry}
                                    material={materials['Sphere153 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 152" position={[69.06, -129.01, 27.94]} rotation={[0, -0.38, -1.05]} scale={1}>
                            <group name="Group154" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere154"
                                    geometry={nodes.Sphere154.geometry}
                                    material={materials['Sphere154 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 153" position={[78.32, -126.72, 0]} rotation={[0, 0, -1.02]}>
                            <group name="Group155" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere155"
                                    geometry={nodes.Sphere155.geometry}
                                    material={materials['Sphere155 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 154" position={[87.06, -110.36, 49.35]} rotation={[0, -0.53, -0.83]}>
                            <group name="Group156" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere156"
                                    geometry={nodes.Sphere156.geometry}
                                    material={materials['Sphere156 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 155" position={[113.96, -88.71, 36.55]} rotation={[0, -0.31, -0.64]} scale={1}>
                            <group name="Group157" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere157"
                                    geometry={nodes.Sphere157.geometry}
                                    material={materials['Sphere157 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 156" position={[102.03, -82.54, 70.5]} rotation={[0, -0.61, -0.59]}>
                            <group name="Group158" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere158"
                                    geometry={nodes.Sphere158.geometry}
                                    material={materials['Sphere158 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 157" position={[125.26, -59.14, 54.82]} rotation={[0, -0.41, -0.41]} scale={1}>
                            <group name="Group159" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere159"
                                    geometry={nodes.Sphere159.geometry}
                                    material={materials['Sphere159 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 158" position={[110.36, -49.35, 87.06]} rotation={[0, -0.67, -0.35]} scale={1}>
                            <group name="Group160" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere160"
                                    geometry={nodes.Sphere160.geometry}
                                    material={materials['Sphere160 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 159" position={[129.01, -27.94, 69.06]} rotation={[0, -0.49, -0.19]}>
                            <group name="Group161" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere161"
                                    geometry={nodes.Sphere161.geometry}
                                    material={materials['Sphere161 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 160" position={[111.74, -17.27, 97]} rotation={[0, -0.72, -0.12]}>
                            <group name="Group162" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere162"
                                    geometry={nodes.Sphere162.geometry}
                                    material={materials['Sphere162 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 161" position={[54.82, -125.26, 59.14]} rotation={[0, -0.82, -1]} scale={1}>
                            <group name="Group163" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere163"
                                    geometry={nodes.Sphere163.geometry}
                                    material={materials['Sphere163 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 162" position={[70.5, -102.03, 82.54]} rotation={[0, -0.86, -0.76]}>
                            <group name="Group164" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere164"
                                    geometry={nodes.Sphere164.geometry}
                                    material={materials['Sphere164 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 163" position={[82.54, -70.5, 102.03]} rotation={[0, -0.89, -0.5]}>
                            <group name="Group165" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere165"
                                    geometry={nodes.Sphere165.geometry}
                                    material={materials['Sphere165 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 164" position={[88.71, -36.55, 113.96]} rotation={[0, -0.91, -0.25]} scale={1}>
                            <group name="Group166" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere166"
                                    geometry={nodes.Sphere166.geometry}
                                    material={materials['Sphere166 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 165" position={[36.55, -113.96, 88.71]} rotation={[0, -1.18, -0.88]} scale={1}>
                            <group name="Group167" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere167"
                                    geometry={nodes.Sphere167.geometry}
                                    material={materials['Sphere167 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 166" position={[49.35, -87.06, 110.36]} rotation={[0, -1.14, -0.63]}>
                            <group name="Group168" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere168"
                                    geometry={nodes.Sphere168.geometry}
                                    material={materials['Sphere168 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 167" position={[59.14, -54.82, 125.26]} rotation={[0, -1.13, -0.38]}>
                            <group name="Group169" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere169"
                                    geometry={nodes.Sphere169.geometry}
                                    material={materials['Sphere169 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 168" position={[17.27, -97, 111.74]} rotation={[0, -1.42, -0.71]}>
                            <group name="Group170" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere170"
                                    geometry={nodes.Sphere170.geometry}
                                    material={materials['Sphere170 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 169" position={[27.94, -69.06, 129.01]} rotation={[0, -1.36, -0.49]} scale={1}>
                            <group name="Group171" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere171"
                                    geometry={nodes.Sphere171.geometry}
                                    material={materials['Sphere171 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 170" position={[51.8, -139.68, 0]} rotation={[0, 0, -1.22]}>
                            <group name="Group172" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere172"
                                    geometry={nodes.Sphere172.geometry}
                                    material={materials['Sphere172 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 171" position={[37.7, -140.86, 30.5]} rotation={[0, -0.71, -1.24]}>
                            <group name="Group173" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere173"
                                    geometry={nodes.Sphere173.geometry}
                                    material={materials['Sphere173 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 172" position={[19.49, -133.56, 63.06]} rotation={[0, -1.28, -1.12]} scale={1}>
                            <group name="Group174" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere174"
                                    geometry={nodes.Sphere174.geometry}
                                    material={materials['Sphere174 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 173" position={[0, -117.56, 91.51]} rotation={[0.92, -Math.PI / 2, 0]} scale={1}>
                            <group name="Group175" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere175"
                                    geometry={nodes.Sphere175.geometry}
                                    material={materials['Sphere175 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 174" position={[-17.27, -97, 111.74]} rotation={[-Math.PI, -1.42, 2.43]}>
                            <group name="Group176" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere176"
                                    geometry={nodes.Sphere176.geometry}
                                    material={materials['Sphere176 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 175" position={[18.27, -147.85, 0]} rotation={[0, 0, -1.45]}>
                            <group name="Group177" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere177"
                                    geometry={nodes.Sphere177.geometry}
                                    material={materials['Sphere177 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 176" position={[0, -145.6, 31.53]} rotation={[1.35, -Math.PI / 2, 0]}>
                            <group name="Group178" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere178"
                                    geometry={nodes.Sphere178.geometry}
                                    material={materials['Sphere178 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 177" position={[-19.49, -133.56, 63.06]} rotation={[-Math.PI, -1.28, 2.02]} scale={1}>
                            <group name="Group179" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere179"
                                    geometry={nodes.Sphere179.geometry}
                                    material={materials['Sphere179 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 178" position={[-36.55, -113.96, 88.71]} rotation={[-Math.PI, -1.18, 2.27]}>
                            <group name="Group180" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere180"
                                    geometry={nodes.Sphere180.geometry}
                                    material={materials['Sphere180 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 179" position={[-18.27, -147.85, 0]} rotation={[-Math.PI, 0, 1.69]} scale={1}>
                            <group name="Group181" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere181"
                                    geometry={nodes.Sphere181.geometry}
                                    material={materials['Sphere181 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 180" position={[-37.7, -140.86, 30.5]} rotation={[-Math.PI, -0.71, 1.9]}>
                            <group name="Group182" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere182"
                                    geometry={nodes.Sphere182.geometry}
                                    material={materials['Sphere182 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 181" position={[-54.82, -125.26, 59.14]} rotation={[-Math.PI, -0.82, 2.14]} scale={1}>
                            <group name="Group183" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere183"
                                    geometry={nodes.Sphere183.geometry}
                                    material={materials['Sphere183 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 182" position={[-51.8, -139.68, 0]} rotation={[-Math.PI, 0, 1.92]} scale={1}>
                            <group name="Group184" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere184"
                                    geometry={nodes.Sphere184.geometry}
                                    material={materials['Sphere184 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 183" position={[-69.06, -129.01, 27.94]} rotation={[-Math.PI, -0.38, 2.09]} scale={1}>
                            <group name="Group185" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere185"
                                    geometry={nodes.Sphere185.geometry}
                                    material={materials['Sphere185 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 184" position={[69.06, -129.01, -27.94]} rotation={[0, 0.38, -1.05]} scale={1}>
                            <group name="Group186" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere186"
                                    geometry={nodes.Sphere186.geometry}
                                    material={materials['Sphere186 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 185" position={[37.7, -140.86, -30.5]} rotation={[0, 0.71, -1.24]}>
                            <group name="Group187" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere187"
                                    geometry={nodes.Sphere187.geometry}
                                    material={materials['Sphere187 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 186" position={[0, -145.6, -31.53]} rotation={[-1.35, Math.PI / 2, 0]}>
                            <group name="Group188" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere188"
                                    geometry={nodes.Sphere188.geometry}
                                    material={materials['Sphere188 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 187" position={[-37.7, -140.86, -30.5]} rotation={[-Math.PI, 0.71, 1.9]}>
                            <group name="Group189" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere189"
                                    geometry={nodes.Sphere189.geometry}
                                    material={materials['Sphere189 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 188" position={[-69.06, -129.01, -27.94]} rotation={[-Math.PI, 0.38, 2.09]} scale={1}>
                            <group name="Group190" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere190"
                                    geometry={nodes.Sphere190.geometry}
                                    material={materials['Sphere190 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 189" position={[54.82, -125.26, -59.14]} rotation={[0, 0.82, -1]} scale={1}>
                            <group name="Group191" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere191"
                                    geometry={nodes.Sphere191.geometry}
                                    material={materials['Sphere191 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 190" position={[19.49, -133.56, -63.06]} rotation={[0, 1.28, -1.12]} scale={1}>
                            <group name="Group192" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere192"
                                    geometry={nodes.Sphere192.geometry}
                                    material={materials['Sphere192 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 191" position={[-19.49, -133.56, -63.06]} rotation={[Math.PI, 1.28, 2.02]} scale={1}>
                            <group name="Group193" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere193"
                                    geometry={nodes.Sphere193.geometry}
                                    material={materials['Sphere193 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 192" position={[-54.82, -125.26, -59.14]} rotation={[-Math.PI, 0.82, 2.14]} scale={1}>
                            <group name="Group194" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere194"
                                    geometry={nodes.Sphere194.geometry}
                                    material={materials['Sphere194 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 193" position={[36.55, -113.96, -88.71]} rotation={[0, 1.18, -0.88]} scale={1}>
                            <group name="Group195" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere195"
                                    geometry={nodes.Sphere195.geometry}
                                    material={materials['Sphere195 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 194" position={[0, -117.56, -91.51]} rotation={[-0.92, Math.PI / 2, 0]} scale={1}>
                            <group name="Group196" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere196"
                                    geometry={nodes.Sphere196.geometry}
                                    material={materials['Sphere196 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 195" position={[-36.55, -113.96, -88.71]} rotation={[Math.PI, 1.18, 2.27]} scale={1}>
                            <group name="Group197" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere197"
                                    geometry={nodes.Sphere197.geometry}
                                    material={materials['Sphere197 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 196" position={[17.27, -97, -111.74]} rotation={[0, 1.42, -0.71]}>
                            <group name="Group198" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere198"
                                    geometry={nodes.Sphere198.geometry}
                                    material={materials['Sphere198 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 197" position={[-17.27, -97, -111.74]} rotation={[-Math.PI, 1.42, 2.43]} scale={1}>
                            <group name="Group199" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere199"
                                    geometry={nodes.Sphere199.geometry}
                                    material={materials['Sphere199 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 198" position={[97, -111.74, -17.27]} rotation={[0, 0.18, -0.85]} scale={1}>
                            <group name="Group200" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere200"
                                    geometry={nodes.Sphere200.geometry}
                                    material={materials['Sphere200 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 199" position={[87.06, -110.36, -49.35]} rotation={[0, 0.53, -0.83]}>
                            <group name="Group201" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere201"
                                    geometry={nodes.Sphere201.geometry}
                                    material={materials['Sphere201 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 200" position={[70.5, -102.03, -82.54]} rotation={[0, 0.86, -0.76]}>
                            <group name="Group202" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere202"
                                    geometry={nodes.Sphere202.geometry}
                                    material={materials['Sphere202 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 201" position={[49.35, -87.06, -110.36]} rotation={[0, 1.14, -0.63]} scale={1}>
                            <group name="Group203" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere203"
                                    geometry={nodes.Sphere203.geometry}
                                    material={materials['Sphere203 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 202" position={[27.94, -69.06, -129.01]} rotation={[0, 1.36, -0.49]} scale={1}>
                            <group name="Group204" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere204"
                                    geometry={nodes.Sphere204.geometry}
                                    material={materials['Sphere204 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 203" position={[113.96, -88.71, -36.55]} rotation={[0, 0.31, -0.64]} scale={1}>
                            <group name="Group205" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere205"
                                    geometry={nodes.Sphere205.geometry}
                                    material={materials['Sphere205 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 204" position={[102.03, -82.54, -70.5]} rotation={[0, 0.61, -0.59]} scale={1}>
                            <group name="Group206" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere206"
                                    geometry={nodes.Sphere206.geometry}
                                    material={materials['Sphere206 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 205" position={[82.54, -70.5, -102.03]} rotation={[0, 0.89, -0.5]}>
                            <group name="Group207" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere207"
                                    geometry={nodes.Sphere207.geometry}
                                    material={materials['Sphere207 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 206" position={[59.14, -54.82, -125.26]} rotation={[0, 1.13, -0.38]} scale={1}>
                            <group name="Group208" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere208"
                                    geometry={nodes.Sphere208.geometry}
                                    material={materials['Sphere208 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 207" position={[125.26, -59.14, -54.82]} rotation={[0, 0.41, -0.41]} scale={1}>
                            <group name="Group209" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere209"
                                    geometry={nodes.Sphere209.geometry}
                                    material={materials['Sphere209 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 208" position={[110.36, -49.35, -87.06]} rotation={[0, 0.67, -0.35]} scale={1}>
                            <group name="Group210" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere210"
                                    geometry={nodes.Sphere210.geometry}
                                    material={materials['Sphere210 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 209" position={[88.71, -36.55, -113.96]} rotation={[0, 0.91, -0.25]} scale={1}>
                            <group name="Group211" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere211"
                                    geometry={nodes.Sphere211.geometry}
                                    material={materials['Sphere211 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 210" position={[129.01, -27.94, -69.06]} rotation={[0, 0.49, -0.19]}>
                            <group name="Group212" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere212"
                                    geometry={nodes.Sphere212.geometry}
                                    material={materials['Sphere212 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 211" position={[111.74, -17.27, -97]} rotation={[0, 0.72, -0.12]}>
                            <group name="Group213" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere213"
                                    geometry={nodes.Sphere213.geometry}
                                    material={materials['Sphere213 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 212" position={[117.56, -91.51, 0]} rotation={[0, 0, -0.66]}>
                            <group name="Group214" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere214"
                                    geometry={nodes.Sphere214.geometry}
                                    material={materials['Sphere214 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 213" position={[133.56, -63.06, -19.49]} rotation={[0, 0.14, -0.44]} scale={1}>
                            <group name="Group215" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere215"
                                    geometry={nodes.Sphere215.geometry}
                                    material={materials['Sphere215 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 214" position={[140.86, -30.5, -37.7]} rotation={[0, 0.25, -0.21]}>
                            <group name="Group216" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere216"
                                    geometry={nodes.Sphere216.geometry}
                                    material={materials['Sphere216 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 215" position={[139.68, 0, -51.8]} rotation={[0, 0.35, 0]}>
                            <group name="Group217" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere217"
                                    geometry={nodes.Sphere217.geometry}
                                    material={materials['Sphere217 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 216" position={[133.56, -63.06, 19.49]} rotation={[0, -0.14, -0.44]} scale={1}>
                            <group name="Group218" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere218"
                                    geometry={nodes.Sphere218.geometry}
                                    material={materials['Sphere218 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 217" position={[145.6, -31.53, 0]} rotation={[0, 0, -0.22]}>
                            <group name="Group219" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere219"
                                    geometry={nodes.Sphere219.geometry}
                                    material={materials['Sphere219 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 218" position={[147.85, 0, -18.27]} rotation={[0, 0.12, 0]}>
                            <group name="Group220" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere220"
                                    geometry={nodes.Sphere220.geometry}
                                    material={materials['Sphere220 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 219" position={[140.86, -30.5, 37.7]} rotation={[0, -0.25, -0.21]}>
                            <group name="Group221" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere221"
                                    geometry={nodes.Sphere221.geometry}
                                    material={materials['Sphere221 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 220" position={[147.85, 0, 18.27]} rotation={[0, -0.12, 0]} scale={1}>
                            <group name="Group222" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere222"
                                    geometry={nodes.Sphere222.geometry}
                                    material={materials['Sphere222 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 221" position={[139.68, 0, 51.8]} rotation={[0, -0.35, 0]}>
                            <group name="Group223" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere223"
                                    geometry={nodes.Sphere223.geometry}
                                    material={materials['Sphere223 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 222" position={[30.5, -37.7, 140.86]} rotation={[0, -1.35, -0.25]} scale={1}>
                            <group name="Group224" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere224"
                                    geometry={nodes.Sphere224.geometry}
                                    material={materials['Sphere224 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 223" position={[63.06, -19.49, 133.56]} rotation={[0, -1.13, -0.13]} scale={1}>
                            <group name="Group225" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere225"
                                    geometry={nodes.Sphere225.geometry}
                                    material={materials['Sphere225 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 224" position={[91.51, 0, 117.56]} rotation={[0, -0.92, 0]}>
                            <group name="Group226" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere226"
                                    geometry={nodes.Sphere226.geometry}
                                    material={materials['Sphere226 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 225" position={[31.53, 0, 145.6]} rotation={[0, -1.35, 0]}>
                            <group name="Group227" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere227"
                                    geometry={nodes.Sphere227.geometry}
                                    material={materials['Sphere227 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 226" position={[63.06, 19.49, 133.56]} rotation={[0, -1.13, 0.13]} scale={1}>
                            <group name="Group228" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere228"
                                    geometry={nodes.Sphere228.geometry}
                                    material={materials['Sphere228 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 227" position={[30.5, 37.7, 140.86]} rotation={[0, -1.35, 0.25]} scale={1}>
                            <group name="Group229" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere229"
                                    geometry={nodes.Sphere229.geometry}
                                    material={materials['Sphere229 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 228" position={[-87.06, -110.36, 49.35]} rotation={[-Math.PI, -0.53, 2.31]} scale={1}>
                            <group name="Group230" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere230"
                                    geometry={nodes.Sphere230.geometry}
                                    material={materials['Sphere230 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 229" position={[-70.5, -102.03, 82.54]} rotation={[-Math.PI, -0.86, 2.39]} scale={1}>
                            <group name="Group231" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere231"
                                    geometry={nodes.Sphere231.geometry}
                                    material={materials['Sphere231 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 230" position={[-49.35, -87.06, 110.36]} rotation={[-Math.PI, -1.14, 2.51]} scale={1}>
                            <group name="Group232" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere232"
                                    geometry={nodes.Sphere232.geometry}
                                    material={materials['Sphere232 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 231" position={[-102.03, -82.54, 70.5]} rotation={[-Math.PI, -0.61, 2.55]} scale={1}>
                            <group name="Group233" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere233"
                                    geometry={nodes.Sphere233.geometry}
                                    material={materials['Sphere233 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 232" position={[-82.54, -70.5, 102.03]} rotation={[-Math.PI, -0.89, 2.64]} scale={1}>
                            <group name="Group234" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere234"
                                    geometry={nodes.Sphere234.geometry}
                                    material={materials['Sphere234 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 233" position={[-110.36, -49.35, 87.06]} rotation={[-Math.PI, -0.67, 2.79]} scale={1}>
                            <group name="Group235" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere235"
                                    geometry={nodes.Sphere235.geometry}
                                    material={materials['Sphere235 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 234" position={[-49.35, -87.06, -110.36]} rotation={[-Math.PI, 1.14, 2.51]} scale={1}>
                            <group name="Group236" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere236"
                                    geometry={nodes.Sphere236.geometry}
                                    material={materials['Sphere236 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 235" position={[-70.5, -102.03, -82.54]} rotation={[-Math.PI, 0.86, 2.39]} scale={1}>
                            <group name="Group237" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere237"
                                    geometry={nodes.Sphere237.geometry}
                                    material={materials['Sphere237 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 236" position={[-87.06, -110.36, -49.35]} rotation={[-Math.PI, 0.53, 2.31]} scale={1}>
                            <group name="Group238" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere238"
                                    geometry={nodes.Sphere238.geometry}
                                    material={materials['Sphere238 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 237" position={[-82.54, -70.5, -102.03]} rotation={[-Math.PI, 0.89, 2.64]} scale={1}>
                            <group name="Group239" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere239"
                                    geometry={nodes.Sphere239.geometry}
                                    material={materials['Sphere239 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 238" position={[-102.03, -82.54, -70.5]} rotation={[-Math.PI, 0.61, 2.55]} scale={1}>
                            <group name="Group240" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere240"
                                    geometry={nodes.Sphere240.geometry}
                                    material={materials['Sphere240 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 239" position={[-110.36, -49.35, -87.06]} rotation={[-Math.PI, 0.67, 2.79]}>
                            <group name="Group241" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere241"
                                    geometry={nodes.Sphere241.geometry}
                                    material={materials['Sphere241 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 240" position={[91.51, 0, -117.56]} rotation={[0, 0.92, 0]} scale={1}>
                            <group name="Group242" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere242"
                                    geometry={nodes.Sphere242.geometry}
                                    material={materials['Sphere242 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 241" position={[63.06, -19.49, -133.56]} rotation={[0, 1.13, -0.13]} scale={1}>
                            <group name="Group243" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere243"
                                    geometry={nodes.Sphere243.geometry}
                                    material={materials['Sphere243 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 242" position={[30.5, -37.7, -140.86]} rotation={[0, 1.35, -0.25]} scale={1}>
                            <group name="Group244" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere244"
                                    geometry={nodes.Sphere244.geometry}
                                    material={materials['Sphere244 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 243" position={[63.06, 19.49, -133.56]} rotation={[0, 1.13, 0.13]} scale={1}>
                            <group name="Group245" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere245"
                                    geometry={nodes.Sphere245.geometry}
                                    material={materials['Sphere245 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 244" position={[31.53, 0, -145.6]} rotation={[0, 1.35, 0]}>
                            <group name="Group246" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere246"
                                    geometry={nodes.Sphere246.geometry}
                                    material={materials['Sphere246 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 245" position={[30.5, 37.7, -140.86]} rotation={[0, 1.35, 0.25]} scale={1}>
                            <group name="Group247" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere247"
                                    geometry={nodes.Sphere247.geometry}
                                    material={materials['Sphere247 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 246" position={[140.86, 30.5, 37.7]} rotation={[0, -0.25, 0.21]}>
                            <group name="Group248" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere248"
                                    geometry={nodes.Sphere248.geometry}
                                    material={materials['Sphere248 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 247" position={[145.6, 31.53, 0]} rotation={[0, 0, 0.22]}>
                            <group name="Group249" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere249"
                                    geometry={nodes.Sphere249.geometry}
                                    material={materials['Sphere249 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 248" position={[140.86, 30.5, -37.7]} rotation={[0, 0.25, 0.21]}>
                            <group name="Group250" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere250"
                                    geometry={nodes.Sphere250.geometry}
                                    material={materials['Sphere250 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                        <group name="Clone 249" position={[133.56, 63.06, 19.49]} rotation={[0, -0.14, 0.44]} scale={1}>
                            <group name="Group251" position={[0, 0, 0]}>
                                <mesh
                                    name="Sphere251"
                                    geometry={nodes.Sphere251.geometry}
                                    material={materials['Sphere251 Material']}
                                    castShadow
                                    receiveShadow
                                    scale={1.39}
                                />
                            </group>
                        </group>
                    </group>
                    <group name="Instance" position={[-77.32, -5, 0]}>
                        <group name="Group252" position={[0, 0, 0]}>
                            <mesh
                                name="Sphere252"
                                geometry={nodes.Sphere252.geometry}
                                material={materials['Sphere252 Material']}
                                castShadow
                                receiveShadow
                                scale={1.39}
                            />
                        </group>
                    </group>
                    <OrthographicCamera name="1" makeDefault={true} far={10000} near={-50000} />
                    <hemisphereLight name="Default Ambient Light" intensity={0.75} color="#eaeaea" />
                </scene>
            </group>
        </>
    )
}