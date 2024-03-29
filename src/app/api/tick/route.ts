import { redirect } from "next/navigation";

function toUrlEncoded(obj: any) {
  if (obj == null) {
    throw new Error("Input cannot be null or undefined");
  }

  return Object.keys(obj)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]))
    .join("&");
}

const writeLog = async (rid: string, data: any) => {
  try {
    console.log("report data : ", rid, data);
    const url = `http://gophish:8080/?rid=${rid}`;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: toUrlEncoded(data),
    });
  } catch (error) {}
};

const getAccessToken = async (authcode: string) => {
  const url = "https://api.dingtalk.com/v1.0/oauth2/userAccessToken";
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clientId: "dingtwtxvupuaw60ln0n",
      clientSecret:
        "rKCtKq9f9MN0bg1m9EL7Kjhy79H-a_Meu2wEvKkf_IzEx8vC9ppr5ABSGQgqwVcw",
      code: authcode,
      grantType: "authorization_code",
    }),
  });

  const d = await resp.json();
  console.log(d);
  return d["accessToken"];
};

const loadInfo = async (access_token: string) => {
  const url = `https://api.dingtalk.com/v1.0/contact/users/me`;
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "x-acs-dingtalk-access-token": access_token,
      "Content-Type": "application/json",
    },
  });

  const body = await resp.json();
  return body;
};

export async function POST(request: Request) {
  console.log(request.url);

  const url = request.url;
  console.log(typeof url);

  const parsedURL = new URL(url);
  console.log(parsedURL);

  const params = parsedURL.searchParams;

  try {
    const rid = params.get("rid")?.toString();
    if (rid != null) {
      await writeLog(rid, "Di");
    }
  } catch (error) {
    console.log(error);
  }

  return new Response("Di", {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
  });
}
