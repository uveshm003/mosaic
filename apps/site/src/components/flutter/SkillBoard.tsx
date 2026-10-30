import type { Skill } from '@mosaic/content/payload-types'

// Category filter in CSS only (radios + :has()), like the Flutter platform filter.
export function SkillBoard({ groups }: { groups: { category: string; skills: Skill[] }[] }) {
  const scope = 'skills-board'
  const slug = (category: string) => category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const css = groups
    .map(
      ({ category }) =>
        `#${scope}:has(#${scope}-${slug(category)}:checked) [data-category]:not([data-category="${slug(category)}"]) { display: none; }`,
    )
    .join('\n')
  return (
    <div id={scope}>
      <style>{css}</style>
      <fieldset className="flex flex-wrap gap-2 font-mono text-xs">
        <legend className="sr-only">Filter skills by category</legend>
        {['All', ...groups.map((g) => g.category)].map((category) => (
          <label key={category} className="cursor-pointer">
            <input
              type="radio"
              name={`${scope}-category`}
              id={`${scope}-${category === 'All' ? 'all' : slug(category)}`}
              defaultChecked={category === 'All'}
              className="peer sr-only"
            />
            <span className="block rounded-full border border-line px-3 py-1.5 text-muted transition peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-fg peer-focus-visible:outline-2 peer-focus-visible:outline-accent hover:text-fg">
              {category}
            </span>
          </label>
        ))}
      </fieldset>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {groups.flatMap(({ category, skills }) =>
          skills.map((skill) => (
            <li
              key={skill.id}
              data-category={slug(category)}
              className="wiggle card flex items-center justify-between gap-2 px-4 py-3 transition hover:border-accent"
            >
              <span className="font-medium">{skill.name}</span>
              <span className="font-mono text-[10px] text-muted uppercase">{category}</span>
            </li>
          )),
        )}
      </ul>
    </div>
  )
}
