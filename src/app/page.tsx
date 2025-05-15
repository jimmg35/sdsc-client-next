import Events from "@/components/Home/Events";
import News from "@/components/Home/News";
import Welcome from "@/components/Home/Welcome";
import WhoWeAre from "@/components/Home/WhoWeAre";

export default function Home() {
  return (
    <div className="h-fit">
      <Welcome />
      <WhoWeAre />
      <div className="px-4 py-12">
        <div className="flex justify-around">
          <News />
          <Events />
        </div>
      </div>
    </div>
  );
}
