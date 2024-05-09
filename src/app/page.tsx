import Footer from "@/components/Footer"
import { Usage } from "@/components/Usage"
import { Features } from "@/components/Features"
import { Pricing } from "@/components/Pricing"
import NavBar from "@/components/NavBar"
import { Hero } from "@/components/Hero"

export default function Home() {
    return (
        <>
            <NavBar />

            <Hero />
            <Features />
            <Usage />
            <Pricing />

            <Footer />
        </>
    )
}
