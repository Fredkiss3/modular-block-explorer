import clsx from "clsx";

interface Props {
  header?: string;
  entryLabels?: string[];
  entries?: Array<[key: string, value: string]>;
}

export function KeyValueList({ header, entryLabels, entries }: Props) {
  return (
    <div className="flex flex-col w-full space-y-4">
      <span className={clsx("font-bold", { hidden: !header })}>{header}</span>
      <div className="flex flex-col flex-1 space-y-4">
        {entries?.map((entry, idx) => (
          <div key={idx} className="flex flex-row space-x-5">
            <label className="w-1/2 font-bold truncate">
              {entryLabels?.[idx]}
            </label>
            <span className="w-1/2 truncate">{entry[1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
