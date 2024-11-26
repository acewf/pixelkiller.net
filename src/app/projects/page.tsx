import Image from "next/image";

import { getProjects } from '@/utils/getData';

export default async function Projects() {
  const projects = await getProjects();


  return (
    <div className="items-center justify-items-center p-4 flex flex-col w-full relative">
      <section className="w-full mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center uppercase">Projects</h2>
        <div className='flex-wrap gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-center'>
          {projects.map(({ name, description, image, id }) => {
            console.log(image)
            return (
              <div className="text-center bg-contrast rounded-lg relative overflow-hidden aspect-[16/12]" key={id}>
                <div
                  className="overflow-hidden rounded-t-lg m-[1px]">
                  <Image
                    src={image}
                    alt={description}
                    width={900}
                    height={600}
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
    </div>
  );
}
