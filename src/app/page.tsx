import { pascalCase } from "change-case";
import Image from "next/image";
import Link from 'next/link';

import Hero from "@/components/Hero";
import SkillsIcons from "@/components/Skills";
import { getSkills, getProjects } from '@/utils/getData';

const ListOfSkills = Object.keys(SkillsIcons);

type IconsKey = {
  name: string;
  icon: keyof (typeof SkillsIcons)
}


export default async function Home() {
  const skillsRaw = await getSkills();
  const skills = skillsRaw.map(({ type, values }) => {
    const filteredValues = values.map((name) => ({ name, icon: pascalCase(name) }))
      .filter((item): item is IconsKey => ListOfSkills.includes(item.icon))
    return {
      type,
      values: filteredValues
    }
  })

  const projects = await getProjects();
  const shortList = projects.slice(0, 3)

  return (
    <div className="items-center justify-items-center p-4 flex flex-col gap-8 w-full relative">
      <Hero />
      <section className="w-full max-w-5xl mx-auto sm:mt-12" id="skills">
        <h2 className="text-3xl font-bold mb-6 uppercase">
          Skills / Tools
        </h2>
        <div className="flex flex-col sm:grid grid-cols-2 md:grid-cols-3 gap-1 sm:gap-6 bg-contrast p-1 sm:p-4 rounded-lg w-full">
          {skills.map(({ type, values }) => (
            <div key={type} className="p-4">
              <ul className="list-none flex flex-wrap sm:flex-col">
                {values.map(({ name, icon }) => {
                  const Icon = SkillsIcons[icon];

                  return (
                    <li key={name} className="flex items-center mb-2 drop-shadow-md mx-2"
                      style={{ '--tw-drop-shadow': "drop-shadow(0 2px 2px rgb(0 0 0 / 0.65))" } as React.CSSProperties}
                    >
                      <Icon />
                      <span className="ml-2">{name}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="w-full max-w-5xl mx-auto sm:mt-12">
        <Link href="/projects">
          <h2 className="text-3xl font-bold mb-6 text-left uppercase">Find out Projects</h2>
        </Link>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center'>
          {shortList.map(({ name, description, image, id }) => {
            return (
              <div className="text-center bg-contrast rounded-lg relative overflow-hidden aspect-[16/12]" key={id}>
                <div
                  className="overflow-hidden rounded-t-lg m-[1px]">
                  <Image
                    src={image}
                    alt={description}
                    width={900}
                    height={600}
                    objectFit="contain"
                  />
                </div>
                <span
                  className="py-2 drop-shadow-md absolute bottom-0 w-full h-10 left-0 bg-contrast"
                  style={{ '--tw-drop-shadow': "drop-shadow(0 2px 2px rgb(0 0 0 / 0.65))" } as React.CSSProperties}
                >
                  {name}
                </span>
              </div>
            )
          })}
        </div>
      </section>
      <section className="w-full max-w-5xl mx-auto sm:mt-12" id="about">
        <h2 className="text-3xl font-bold mb-6 text-left uppercase">About me</h2>
        <div className=" max-w-3xl my-4">
          <span className="text-pretty">
            A highly driven and detail-oriented web developer with a passion for solving complex problems and delivering top-quality results. Known for persistence in overcoming technical challenges while maintaining strong, positive relationships with colleagues.
            Skilled in effective communication, open to feedback, and committed to fostering teamwork and collaboration. Adept at balancing individual contributions with the overall success of the team, ensuring timely project delivery and optimized solutions.
          </span>
        </div>
        <div>
          <span className="block">Reach me at</span>
          <a href="mailto:contact@pixelkiller.net">contact@pixelkiller.net</a>
        </div>
      </section>
    </div>
  );
}
