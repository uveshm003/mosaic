import { allPlatforms, platformLabel } from '../lib/content'

// CSS-only filter: radios plus :has(), so it costs no JavaScript and works with the keyboard.
// Items opt in with data-platforms="android ios" inside an element with the given scope id.
export function PlatformFilter({
  scope,
  legend,
  className,
  optionClassName,
}: {
  scope: string
  legend: string
  className?: string
  optionClassName?: string
}) {
  const css = allPlatforms
    .map(
      (platform) =>
        `#${scope}:has(#${scope}-${platform}:checked) [data-platforms]:not([data-platforms~="${platform}"]) { display: none; }`,
    )
    .join('\n')
  return (
    <fieldset className={className}>
      <legend className="sr-only">{legend}</legend>
      <style>{css}</style>
      {(['all', ...allPlatforms] as const).map((platform) => (
        <label key={platform} className={optionClassName}>
          <input
            type="radio"
            name={`${scope}-platform`}
            id={`${scope}-${platform}`}
            defaultChecked={platform === 'all'}
            className="peer sr-only"
          />
          <span>{platform === 'all' ? 'All' : platformLabel[platform]}</span>
        </label>
      ))}
    </fieldset>
  )
}
