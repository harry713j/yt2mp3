import { convertToMp3 } from "@/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Footer } from "@/components/footer";
import { Loader2, Download } from "lucide-react";
import type { ConvertResponse } from "@/types/api";

function App() {
  const [inputURL, setInputURL] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadResponse, setDownloadResponse] = useState<ConvertResponse>();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!inputURL) return;
      const response = await convertToMp3({ url: inputURL });

      if (!response.ok) {
        toast.error("Failed to convert!");
      }

      const blob = await response.blob();
      const fileName =
        response.headers
          .get("Content-Disposition")
          ?.split("filename=")[1]
          ?.replace(/"/g, "") || "audio.mp3";

      console.log(response.headers.get("Content-Disposition"));

      const newDownloadResponse: ConvertResponse = {
        downloadURL: window.URL.createObjectURL(blob),
        fileName,
      };

      setDownloadResponse(newDownloadResponse);

      toast.success("Conversion successful!");
    } catch (err) {
      toast.error("Failed to convert! ", {
        description: (err as Error).message,
        closeButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-conic-240 from-blue-400 via-blue-200 to-blue-400">
      <div className="flex flex-1 items-center justify-center">
        <Card className="self-center">
          <CardHeader className="md:text-2xl text-xl font-semibold text-slate-700 underline decoration-[1.5px]">
            Convert YouTube Video to Mp3 Audio
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {downloadResponse ? (
              <>
                <h3 className="md:text-xl text-lg text-center font-medium text-slate-700/70">
                  {downloadResponse.fileName}
                </h3>
                <div className="flex w-full items-center justify-around">
                  <a
                    href={downloadResponse.downloadURL}
                    download={downloadResponse.fileName}
                    className="w-2/5"
                    onClick={() => {
                      setInputURL("");
                    }}
                  >
                    <Button className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600">
                      <Download className="w-5 h-5" />
                      Download MP3
                    </Button>
                  </a>
                  <Button
                    className=""
                    onClick={() => {
                      window.URL.revokeObjectURL(downloadResponse.downloadURL);
                      setDownloadResponse(undefined);
                      setInputURL("");
                    }}
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <form
                onSubmit={onSubmit}
                className=" mt-4 flex flex-col gap-5 items-start"
              >
                <Input
                  placeholder="Enter your YouTube URL..."
                  value={inputURL}
                  onChange={(e) => setInputURL(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape" && inputURL) {
                      setInputURL("");
                    }
                  }}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="capitalize font-medium flex items-center gap-2 justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Please Wait
                    </>
                  ) : (
                    "Convert"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer className="w-full" />
    </div>
  );
}

export default App;
