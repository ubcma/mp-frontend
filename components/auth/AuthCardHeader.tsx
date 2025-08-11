export default function AuthCardHeader({heading, subheading}: {heading: string, subheading: string}) {
  return (
    <span>
          <h2 className="font-semibold md:text-xl text-2xl mb-2">{heading}</h2>
          <h4 className="font-normal md:text-sm text-md text-muted-foreground">
            {subheading}
          </h4>
    </span>
  );
}