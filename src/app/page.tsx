"use client";

import Link from "next/link";
import Image from "next/image";
import WeiboSvg from "./weibo.svg";
import QRCode from "qrcode";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Component() {
  const searchParams = useSearchParams();
  const clientID = "dingtwtxvupuaw60ln0n";
  const rewriteURL = "https://ddinfo.vercel.app/api/auth";

  const [dingUrl, updateDingUrl] = useState("");
  const [url, updateUrl] = useState("");
  useEffect(() => {
    const makeUrl = async (rid: string) => {
      const loginUrl = `https://login.dingtalk.com/oauth2/auth?redirect_uri=${rewriteURL}&response_type=code&client_id=${clientID}&scope=openid&state=${rid}&prompt=consent`;
      const url = await QRCode.toDataURL(loginUrl);
      updateUrl(url);
      updateDingUrl(
        "dingtalk://dingtalkclient/page/link?url=" +
          encodeURIComponent(loginUrl)
      );
    };

    const markRid = async (rid: string) => {
      await fetch("/api/tick?rid=" + rid, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
    };

    let rid = searchParams.get("rid");
    if (!rid) {
      rid = "default";
    }
    makeUrl(rid);
    markRid(rid);
  }, [searchParams]);

  return (
    <>
      <div
        className="flex h-screen w-full items-center justify-center bg-gray-100"
        style={{ color: "black" }}
      >
        <div className="flex w-[400px] flex-col items-center rounded-lg bg-white p-10 shadow-lg">
          <Image src={WeiboSvg} alt="Weibo" height="40" width="40" />
          <h1 className="mt-4 text-xl font-semibold">请使用钉钉扫码登录</h1>
          <a className="font-bold text-tahiti" href={dingUrl}>
            点击用钉钉打开
          </a>
          <div className="mt-6 flex h-56 w-56 items-center justify-center rounded-lg border p-4">
            <a className="font-bold text-tahiti" href={dingUrl}>
              <Image
                alt="QR Code"
                className="h-full w-full"
                height="200"
                src={url}
                width="200"
              />
            </a>
          </div>
          <div className="mt-4 flex items-center">
            <input type="checkbox" id="remember-me" />
            <label className="ml-2 text-sm" htmlFor="remember-me">
              自动登录
            </label>
          </div>
          <div className="mt-6 text-xs text-gray-400">
            <Link className="mr-2" href="#">
              隐私政策
            </Link>
            <Link className="mr-2" href="#">
              法律条款
            </Link>
            <Link href="#">帮助中心</Link>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 w-full text-center text-xs text-gray-400">
        <p>© 2014-2024 Weibo 公司 版权所有</p>
        <div className="mt-1">
          <Link className="mr-2" href="#">
            隐私政策
          </Link>
          <Link className="mr-2" href="#">
            服务条款
          </Link>
          <Link className="mr-2" href="#">
            法律声明
          </Link>
          <Link href="#">法律声明</Link>
        </div>
      </div>
    </>
  );
}
