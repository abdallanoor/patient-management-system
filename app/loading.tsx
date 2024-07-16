import NextTopLoader from "nextjs-toploader";

export default function Loading() {
  return (
    <NextTopLoader
      color="#f4f4f5"
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow="none"
    />
  );
}
