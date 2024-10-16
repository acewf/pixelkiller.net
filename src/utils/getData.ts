import { promises as fs } from 'fs';

type Projects = {
  "name": string,
  "description": string,
  "image": string
}

type Skills = {
  "type": string,
  "values": string[]
}

export const getProjects = async () => {
  const file = await fs.readFile(process.cwd() + '/src/data.json', 'utf8');
  const data: { projects: Projects[] } = await JSON.parse(file);
  const projects = data.projects.reverse()
    .map((item) => ({ ...item, id: crypto.randomUUID() }));

  return projects;
}

export const getSkills = async () => {
  const file = await fs.readFile(process.cwd() + '/src/data.json', 'utf8');
  const data: { skills: Skills[] } = await JSON.parse(file);

  return data.skills;
}
