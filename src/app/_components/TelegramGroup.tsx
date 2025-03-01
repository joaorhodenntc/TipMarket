import { RiTelegramLine } from "react-icons/ri";

export default function TelegramGroup() {
  return (
    <div className="flex items-center justify-center flex-col mt-16">
      <div className="flex text-white items-center gap-2">
        <RiTelegramLine className="w-5 h-5" />
        <a
          className="text-[16px] "
          href="https://google.com.br"
          target="_blank"
        >
          ENTRAR GRUPO <span className="text-[#24A1DE]">TELEGRAM</span>
        </a>
      </div>
      <p className="text-[#a89c9c] text-[13px] w-1/2 text-center mt-2 pb-5">
        RECEBA ALERTAS QUANDO A TIP ESTIVER DISPONÍVEL
      </p>
    </div>
  );
}
