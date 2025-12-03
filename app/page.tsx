"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Shield, AlertTriangle, CheckCircle2, XCircle, Mail, ZoomIn } from "lucide-react"

type Email = {
  id: number
  from: string
  subject: string
  body: string
  image?: string
  isPhishing: boolean
  redFlags: string[]
}

const emails: Email[] = [
  {
    id: 1,
    from: "info@tax.ee <info@tax.ee>",
    subject: "EMTA : Teavitus: Maksmata maksukohustus",
    body: "Kallis Klient,\n\nTeie Maksuameti profiil kinnitab õigust 346,41 eurot suurusele tagastusele.\n\nProtsessi jätkamiseks uuendage oma pangakonto andmeid meie ohutul portaalis.\n\nhttps://emta.ee/ariklient/maksud-ja-tasumine/\n\nNB! Jäta andmed uuendamata 48 tunni jooksul ja ei saa me teostada tagasimakset.\n\nParimate soovidega,\nMaksu- ja Tolliamet\n\n© 2025 Maksu- ja Tolliamet. Kõik õigused kaitstud.\n\n- Emta Team\n\n\nContact: info@tax.ee\nIf you prefer not to receive emails like this, you may opt out",
    image: "/quiz-images/quiz1.png",
    isPhishing: true,
    redFlags: [
      "Mittepersonaalne lähenemine (ei pöörduta konkreetse isiku poole)",
      "Pakutakse raha",
      "Kirjavead (“ohutul portaalis”)",
      "Pangakonto andmete küsimine",
      "Kiireloomulisusele viitamine ja rahast ilmajäämisega ähvardamine",
    ],
  },
  {
    id: 2,
    from: "Telia.ee (arved@telia.ee) <system@sent-via.netsuite.com>",
    subject: "Tasumata arve nr. 11002898493",
    body: "Hea klient!\n\nSellele kirjale on lisatud sinu Telia teenuste arve. Kiri on väljastatud automaatselt, palume sellele mitte vastata.\n\nTeie viimane arve on tasumata - palume see koheselt tasuda, et vältida võimalikke lisatasusid või teenusepiiranguid.\n\nMaksmisele kuuluv summa seisuga 24.11.2025 on 35.00 €.\n\nTeie finantsasutus lükkas viimase makse tagasi, mistõttu püsimakse ei ole hetkel saadaval enne, kui arve on tasutud. Arve saab tasuda otse siit.\n\n[Arvet maksma button]\n\nSul tekkis mõni küsimus? Võta meiega ühendust Telia kodulehel asuva vestlusakna kaudu.\n\nTelia Eesti AS.",
    image: "/quiz-images/quiz2.png",
    isPhishing: true,
    redFlags: [
      "Meiliaadress ja saatja ei kattu",
      "Mittepersonaalne lähenemine (ei pöörduta konkreetse isiku poole)",
      "Ähvardamine lisatasude ja teenusepiirangutega",
    ],
  },
]

function FullScreenImage({ src, alt }: { src: string; alt: string }) {
  return (
    <DialogClose asChild>
      <div className="relative w-full h-full flex items-center justify-center cursor-pointer" title="Sulge">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain p-4"
        />
      </div>
    </DialogClose>
  )
}

export default function PhishingQuiz() {
  const [currentEmail, setCurrentEmail] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null)
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (isPhishing: boolean) => {
    const correct = isPhishing === emails[currentEmail].isPhishing
    setUserAnswer(isPhishing)
    setAnswered(true)
    if (correct) {
      setScore(score + 1)
    }
  }

  const nextEmail = () => {
    if (currentEmail < emails.length - 1) {
      setCurrentEmail(currentEmail + 1)
      setAnswered(false)
      setUserAnswer(null)
    } else {
      setShowResults(true)
    }
  }

  const resetQuiz = () => {
    setCurrentEmail(0)
    setScore(0)
    setAnswered(false)
    setUserAnswer(null)
    setShowResults(false)
  }

  const email = emails[currentEmail]
  const isCorrect = userAnswer === email.isPhishing

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Pettuse teadlikkuse quiz</h1>
          </div>
          <Badge variant="secondary" className="text-sm">
            Küsimus {currentEmail + 1} / {emails.length}
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {!showResults ? (
          <>
            {/* Instructions */}
            <Card className="mb-6 border-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="h-5 w-5" />
                  Vaata see e-kiri hoolikalt üle
                </CardTitle>
                <CardDescription>
                  Otsusta, kas tegemist on legitiimse kirjaga või pettusega, mille eesmärk on varastada sinu andmeid.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Email Display */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                {email.image ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="rounded-md border overflow-hidden cursor-zoom-in group relative">
                        <img
                          src={email.image || "/placeholder.svg"}
                          alt="E-kirja sisu"
                          className="w-full h-auto object-contain"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <div className="bg-background/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <ZoomIn className="h-6 w-6 text-foreground" />
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-none sm:max-w-none w-screen h-screen m-0 p-0 rounded-none border-none bg-black/95 flex flex-col items-center justify-center">
                       <DialogTitle className="sr-only">E-kirja eelvaade</DialogTitle>
                       <FullScreenImage src={email.image} alt="E-kirja sisu" />
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed bg-muted/20 p-4 rounded-md border">
                    {email.body}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Answer Buttons */}
            {!answered && (
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => handleAnswer(false)}
                  size="lg"
                  variant="outline"
                  className="flex-1 max-w-xs h-auto py-4 flex-col gap-2 hover:bg-green-50 hover:border-green-500 dark:hover:bg-green-950"
                >
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <span className="font-semibold">Legitiimne e-kiri</span>
                  <span className="text-xs text-muted-foreground">See kiri on ohutu</span>
                </Button>
                <Button
                  onClick={() => handleAnswer(true)}
                  size="lg"
                  variant="outline"
                  className="flex-1 max-w-xs h-auto py-4 flex-col gap-2 hover:bg-red-50 hover:border-red-500 dark:hover:bg-red-950"
                >
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  <span className="font-semibold">Pettus</span>
                  <span className="text-xs text-muted-foreground">See kiri on kahtlane</span>
                </Button>
              </div>
            )}

            {/* Feedback */}
            {answered && (
              <Card
                className={`border-2 ${isCorrect ? "border-green-500 bg-green-50 dark:bg-green-950" : "border-red-500 bg-red-50 dark:bg-red-950"}`}
              >
                <CardHeader>
                  <CardTitle
                    className={`flex items-center gap-2 ${isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="h-6 w-6" />
                        Õige!
                      </>
                    ) : (
                      <>
                        <XCircle className="h-6 w-6" />
                        Vale
                      </>
                    )}
                  </CardTitle>
                  <CardDescription
                    className={isCorrect ? "text-green-600 dark:text-green-300" : "text-red-600 dark:text-red-300"}
                  >
                    See e-kiri on {email.isPhishing ? "pettus" : "legitiimne"}
                  </CardDescription>
                </CardHeader>
                {email.isPhishing && (
                  <CardContent>
                    <p className="font-semibold mb-2 text-foreground">Ohumärgid, mida jälgida:</p>
                    <ul className="space-y-1">
                      {email.redFlags.map((flag, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                          <AlertTriangle className="h-4 w-4 mt-0.5 text-red-600 shrink-0" />
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                )}
                <CardContent>
                  <Button onClick={nextEmail} className="w-full">
                    {currentEmail < emails.length - 1 ? "Järgmine küsimus" : "Vaata tulemusi"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          /* Results Screen */
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl">Quiz on tehtud!</CardTitle>
              <CardDescription className="text-lg mt-2">
                Sinu skoor: {score} / {emails.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-6xl font-bold text-primary">{Math.round((score / emails.length) * 100)}%</div>
              <p className="text-muted-foreground">
                {score === emails.length && "Täiuslik skoor! Oled ekspert pettuste tuvastamises!"}
                {score >= emails.length * 0.7 &&
                  score < emails.length &&
                  "Väga tubli! Oskad hästi pettusi märgata."}
                {score >= emails.length * 0.5 &&
                  score < emails.length * 0.7 &&
                  "Pole paha! Jätka harjutamist, et oma oskusi parandada."}
                {score < emails.length * 0.5 &&
                  "Jätka õppimist! Nende ohumärkide tundmine aitab sul end veebis kaitsta."}
              </p>
              <Button onClick={resetQuiz} size="lg" className="mt-4">
                Alusta uuesti
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
