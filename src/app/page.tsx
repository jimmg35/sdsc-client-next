import Footer from "@/components/Footer";
import Welcome from "@/components/Welcome";
import WhoWeAre from "@/components/WhoWeAre";

export default function Home() {
  return (
    <div className="h-fit">
      <Welcome />
      <WhoWeAre />
      <Footer />
    </div>
  );
}
