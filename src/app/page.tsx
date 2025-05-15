import News from "@/components/Home/News";
import Welcome from "@/components/Home/Welcome";
import WhoWeAre from "@/components/Home/WhoWeAre";

export default function Home() {
  return (
    <div className="h-fit">
      <Welcome />
      <WhoWeAre />
      <News />
      {/* <Events /> */}
    </div>
  );
}
