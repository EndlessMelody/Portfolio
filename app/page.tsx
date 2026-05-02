import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { SectionDivider } from "@/components/ui/SectionDivider";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SectionDivider variant="wave" flip />
      <About />
      <SectionDivider variant="wave" />
      <Skills />
      <SectionDivider variant="wave" flip />
      <Projects />
      <Experience />
      <SectionDivider variant="wave" flip />
      <Contact />
    </>
  );
}
