import Associated from "./associated";

/**
 * Note:
 * Passing resource path to RSCs because there doesn't seem any good way of accessing them directly yet
 * */
export default async function EntityPage(props: any) {
  return <div>
    {/* @ts-expect-error Async Server Component */}
    <Associated resourcePath={props.params}/>
  </div>;
}
