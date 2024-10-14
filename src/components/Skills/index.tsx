import React from "@/components/Skills/React";
import Next from "@/components/Skills/Next";
import Tailwind from "@/components/Skills/Tailwind";
import Pixi from "@/components/Skills/Pixi";
import Node from "@/components/Skills/Node";
import Express from "@/components/Skills/Express";
import MongoDB from "@/components/Skills/MongoDB";
import Git from "@/components/Skills/Git";
import Docker from "@/components/Skills/Docker";
import Gitlab from "@/components/Skills/Gitlab";
import OpenAPI from "@/components/Skills/OpenApi";
import ShellScript from "@/components/Skills/Shell";

export {
  React,
  Next,
  Tailwind,
  Pixi,
  Node,
  Express,
  MongoDB,
  Git,
  Docker,
  Gitlab,
  OpenAPI,
  ShellScript,
};


const skills = [
  {
    type: "Frontend",
    skills: [
      {
        name: "React",
        icon: React,
      },
      {
        name: "Next.js",
        icon: Next,
      },
      {
        name: "Tailwindcss",
        icon: Tailwind,
      },
      {
        name: "Pixi.js",
        icon: Pixi,
      },
    ],
  },
  {
    type: "Backend",
    skills: [
      {
        name: "Node",
        icon: Node,
      },
      {
        name: "Express",
        icon: Express,
      },
      {
        name: "MongoDB",
        icon: MongoDB,
      },
      {
        name: "OpenAPI",
        icon: OpenAPI,
      },
    ],
  },
  {
    type: "Other",
    skills: [
      {
        name: "Git",
        icon: Git,
      },
      {
        name: "Docker",
        icon: Docker,
      },
      {
        name: "Gitlab CI/CD",
        icon: Gitlab,
      },
      {
        name: "Shell Script",
        icon: ShellScript,
      },
    ],
  },
];

export default skills;
