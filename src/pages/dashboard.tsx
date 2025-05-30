import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MorphingText } from "@/components/magicui/morphing-text";
import { WarpBackground } from "@/components/magicui/warp-background";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";

type Throw = {
  id?: string;
  height?: number;
  speed?: number;
  strength?: number;
};

export default function Dashboard() {
  const [throws, setThrows] = useState<Throw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchThrows() {
      try {
        const res = await fetch("/api/throws");
        const data = await res.json();
        setThrows(data.throws || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch throws:", err);
      }
    }

    fetchThrows();
    const interval = setInterval(fetchThrows, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-6">Loading throws from AO...</div>;

  const highestSpeed = throws.reduce((a, b) => ((a?.speed ?? 0) > (b?.speed ?? 0) ? a : b), throws[0]);
  const highestHeight = throws.reduce((a, b) => ((a?.height ?? 0) > (b?.height ?? 0) ? a : b), throws[0]);
  const highestStrength = throws.reduce((a, b) => ((a?.strength ?? 0) > (b?.strength ?? 0) ? a : b), throws[0]);

  return (
    <WarpBackground className="min-h-screen bg-[#f8f6f1]">
      <main className="p-6 space-y-6">
        <div className="flex justify-center">
          <MorphingText
            texts={["AO Ball", "Permaweb"]}
            className="text-neutral-800"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <h2 className="text-lg font-semibold">Highest Speed</h2>
              <p>ID: {highestSpeed?.id || "-"}</p>
              <p>{highestSpeed?.speed} m/s</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <h2 className="text-lg font-semibold">Highest Height</h2>
              <p>ID: {highestHeight?.id || "-"}</p>
              <p>{highestHeight?.height} m</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <h2 className="text-lg font-semibold">Highest Strength</h2>
              <p>ID: {highestStrength?.id || "-"}</p>
              <p>{highestStrength?.strength} g</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-2">All Throws (latest first)</h3>
            <div className="space-y-2">
              {[...throws].reverse().map((t, index) => (
                <Card key={t.id || index} className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">ID: {t.id || "-"}</p>
                    <div className="space-x-2">
                      <Badge>Height: {t.height}m</Badge>
                      <Badge>Speed: {t.speed}m/s</Badge>
                      <Badge>Strength: {t.strength}g</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Top 10 Throws (by speed)</h3>
            <div className="space-y-2">
              {[...throws]
                .sort((a, b) => (b?.speed ?? 0) - (a?.speed ?? 0))
                .slice(0, 10)
                .map((t, index) => (
                  <Card key={t.id || index} className="p-4">
                    <p className="font-medium">ID: {t.id || "-"}</p>
                    <p>Speed: {t.speed} m/s</p>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </main>
      <div className="w-full flex justify-center mt-4">
        <AnimatedShinyText shimmerWidth={80} className="text-gray-500 text-sm">
          powered by aura
        </AnimatedShinyText>
      </div>
    </WarpBackground>
  );
}
