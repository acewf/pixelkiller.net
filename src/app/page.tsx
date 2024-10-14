import Hero from "@/components/Hero";

import skills from "@/components/Skills";


export default function Home() {
  return (
    <div className="items-center justify-items-center p-4 flex flex-col gap-8 w-full relative">
      <Hero />
      <section className="w-full max-w-4xl mx-auto mt-12">
        <h2 className="text-3xl font-bold mb-6 text-center uppercase">Skills</h2>
        <div className="flex flex-col sm:grid grid-cols-2 md:grid-cols-3 gap-6">
          {skills.map((category) => (
            <div key={category.type} className="bg-contrast p-4 rounded-lg">
              <h3
                className="text-xl font-semibold mb-2 uppercase drop-shadow-md"
                style={{ '--tw-drop-shadow': "drop-shadow(0 2px 2px rgb(0 0 0 / 0.65))" } as React.CSSProperties}
              >
                {category.type}
              </h3>
              <ul className="list-none">
                {category.skills.map((skill) => (
                  <li key={skill.name} className="flex items-center mb-2 drop-shadow-md"
                    style={{ '--tw-drop-shadow': "drop-shadow(0 2px 2px rgb(0 0 0 / 0.65))" } as React.CSSProperties}
                  >
                    <skill.icon />
                    <span className="ml-2">{skill.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
