import { convertToMp3 } from "@/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Footer } from "@/components/footer";

function App() {
  const [inputURL, setInputURL] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!inputURL) return;
      const response = await convertToMp3({ url: inputURL });

      if (response.ok) {
        toast.success("Conversion successful!");
      }
    } catch (err) {
      toast.error("Failed to convert! ", {
        description: (err as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-conic-240 from-blue-400 via-blue-200 to-blue-400">
      <div className="flex flex-1 items-center justify-center">
        <Card className="self-center">
          <CardHeader className="text-2xl font-semibold text-slate-700 underline decoration-[1.5px]">
            Convert YouTube Video to Mp3 Audio
          </CardHeader>
          <CardContent>
            <form
              onSubmit={onSubmit}
              className=" mt-4 flex flex-col gap-5 items-start"
            >
              <Input
                placeholder="Enter your YouTube URL..."
                value={inputURL}
                onChange={(e) => setInputURL(e.target.value)}
              />
              <Button
                type="submit"
                disabled={loading}
                className="capitalize font-medium"
              >
                {loading ? (
                  <span>
                    <svg
                      className="mr-3 size-5 motion-safe:animate-spin ..."
                      viewBox="0 0 24 24"
                    ></svg>
                    Processing
                  </span>
                ) : (
                  "Convert"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer className="w-full" />
    </div>
  );
}

export default App;
