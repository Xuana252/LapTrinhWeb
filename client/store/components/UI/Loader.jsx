import Image from "@node_modules/next/image";
const appLogo = process.env.NEXT_PUBLIC_APP_LOGO;
export function NumberLoader() {
  return (
    <span className="max-h-[1em] w-fit overflow-auto no-scrollbar flex flex-row gap-1">
      <span
        className="number-scroll-up  w-fit "
        style={{ animationDelay: `-2s` }}
      >
        <span>3</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>3</span>
      </span>
      <span
        className="number-scroll-down  w-fit"
        style={{ animationDelay: `-0s` }}
      >
        <span>9</span>
        <span>3</span>
        <span>3</span>
        <span>5</span>
        <span>9</span>
      </span>

      <span
        className="number-scroll-up w-fit"
        style={{ animationDelay: `-1s` }}
      >
        <span>7</span>
        <span>4</span>
        <span>2</span>
        <span>9</span>
        <span>7</span>
      </span>
    </span>
  );
}

export function AppLogoLoader() {
  return (
    <div className="w-full flex flex-col items-center justify-center  overflow-x-auto h-full min-h-[300px]">
      <img
        src={appLogo}
        alt="Logo"
        width={100}
        height={100}
        className="animate-pulse rounded size-[48px] bg-black p-1"
      />
    </div>
  );
}
