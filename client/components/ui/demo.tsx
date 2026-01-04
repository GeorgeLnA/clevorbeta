"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden pb-0 pt-0">
      <div className="max-w-[1720px] mx-auto flex items-center gap-[100px] px-8">
        {/* Left Side - Text Content */}
        <div className="flex-1 max-w-[682px]">
          <h2 className="text-clevor-persian-blue font-fustat text-[64px] font-bold leading-[76.8px] tracking-[-1px] mb-10">
            A Web3 Bank in the
            Palm of Your Hand
          </h2>
          <div className="relative">
            <div
              className="bg-gradient-to-r from-transparent to-transparent pl-8 border-l-4 border-gradient-to-b from-purple-500 to-teal-400"
              style={{
                backgroundImage: `url('https://api.builder.io/api/v1/image/assets/TEMP/1e687471164ec9aba8c2be2d6c0666ca40c0009d?width=1274')`,
                backgroundSize: '0.785% 125.194%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left center',
              }}
            >
              <p className="text-clevor-cod-gray font-fustat text-xl font-light leading-[30px]">
                cardz Card is more than just a payment tool—it is a self-custodial
                hardware wallet that enables 100% on-chain transactions. Whether
                you are managing your digital assets, making instant stablecoin
                cross-border payments without using the traditional banking system,
                or paying with crypto via Mastercard, our card ensures seamless,
                secure, and borderless financial interactions. Defi and Tradefi all in
                one single card.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - iPhone with Scroll Animation */}
        <div className="flex-1 flex justify-end">
          <ContainerScroll
            titleComponent={null}
          >
            <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center">
              <span className="text-gray-400">Image removed</span>
            </div>
          </ContainerScroll>
        </div>
      </div>
    </div>
  );
}
