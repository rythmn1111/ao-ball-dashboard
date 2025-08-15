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
  accel?: number;
  player?: string;
};

export default function Dashboard() {
  const [throws, setThrows] = useState<Throw[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHeight, setShowHeight] = useState(false);

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.code === 'Space') {
        event.preventDefault();
        setShowHeight(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
             texts={["Blockchain Ball", "Permaweb"]}
             className="text-neutral-800"
           />
         </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-4 text-center">
              <h2 className="text-lg font-semibold">Highest Speed</h2>
                             <p>Player: {highestSpeed?.player || "Unknown"}</p>
               <p>ID: {highestSpeed?.id || "-"}</p>
              <p>{highestSpeed?.speed} m/s</p>
            </CardContent>
          </Card>
          {showHeight && (
            <Card>
              <CardContent className="p-4 text-center">
                <h2 className="text-lg font-semibold">Highest Height</h2>
                                 <p>Player: {highestHeight?.player || "Unknown"}</p>
                 <p>ID: {highestHeight?.id || "-"}</p>
                <p>{highestHeight?.height} cm</p>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className="p-4 text-center">
              <h2 className="text-lg font-semibold">Highest Strength</h2>
                             <p>Player: {highestStrength?.player || "Unknown"}</p>
               <p>ID: {highestStrength?.id || "-"}</p>
              <p>{highestStrength?.strength} g</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <h2 className="text-lg font-semibold">Total Throws</h2>
              <p className="text-2xl font-bold">{throws.length}</p>
              <p>Players tracked</p>
            </CardContent>
          </Card>
        </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-2">All Throws (latest first)</h3>
            <div className="space-y-2">
              {[...throws].reverse().map((t, index) => (
                <Card key={t.id || index} className="p-4">
                  <div className="flex items-center justify-between">
                                         <div>
                       <p className="font-medium">{t.player || "Unknown"}</p>
                       <p className="text-sm text-gray-600">ID: {t.id || "-"}</p>
                     </div>
                                                              <div className="space-x-2">
                        {showHeight && <Badge>Height: {t.height}cm</Badge>}
                        <Badge>Speed: {t.speed}m/s</Badge>
                        <Badge>Strength: {t.strength}g</Badge>
                        {t.accel && <Badge>Accel: {t.accel}</Badge>}
                      </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Top 10 Throws (by speed)</h3>
              <div className="space-y-2">
                {[...throws]
                  .sort((a, b) => (b?.speed ?? 0) - (a?.speed ?? 0))
                  .slice(0, 10)
                  .map((t, index) => (
                    <Card key={t.id || index} className="p-4">
                                           <p className="font-medium">{t.player || "Unknown"}</p>
                     <p className="text-sm text-gray-600">ID: {t.id || "-"}</p>
                      <p>Speed: {t.speed} m/s</p>
                    </Card>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">Player Statistics</h3>
              <div className="space-y-2">
                {(() => {
                  const playerStats = throws.reduce((acc, t) => {
                    const player = t.player || "Unknown";
                    if (!acc[player]) {
                      acc[player] = { count: 0, totalSpeed: 0, totalHeight: 0, totalStrength: 0 };
                    }
                    acc[player].count++;
                    acc[player].totalSpeed += t.speed || 0;
                    acc[player].totalHeight += t.height || 0;
                    acc[player].totalStrength += t.strength || 0;
                    return acc;
                  }, {} as Record<string, { count: number; totalSpeed: number; totalHeight: number; totalStrength: number }>);

                  return Object.entries(playerStats)
                    .sort(([, a], [, b]) => b.count - a.count)
                    .map(([player, stats]) => (
                      <Card key={player} className="p-4">
                        <p className="font-medium">{player}</p>
                                                                          <p className="text-sm text-gray-600">Throws: {stats.count}</p>
                          <p className="text-sm text-gray-600">Avg Speed: {(stats.totalSpeed / stats.count).toFixed(2)} m/s</p>
                          {showHeight && <p className="text-sm text-gray-600">Avg Height: {(stats.totalHeight / stats.count).toFixed(2)} cm</p>}
                      </Card>
                    ));
                })()}
              </div>
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
