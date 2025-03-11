import Image from "next/image";
import PurchaseTip from "./_components/PurchaseTip";
import TelegramGroup from "./_components/TelegramGroup";
import Header from "./_components/Header";
import ViewHistory from "./_components/ViewHistory";
export default function Home() {
  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center gap-2 pt-10">
        <Image src="/logo.png" width={100} height={100} alt="Logo" />
        <h1 className="text-white font-bold text-[16px] mt-3">
          O MELHOR PALPITE DIÁRIO.
        </h1>
        <p className="text-[#a89c9c] text-[13px]">UMA BET, UMA CHANCE.</p>
      </div>
      <PurchaseTip />
      <ViewHistory />
      <TelegramGroup />
    </div>
  );
}
