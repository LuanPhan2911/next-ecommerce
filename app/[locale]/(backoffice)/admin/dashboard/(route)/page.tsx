import { useTranslations } from "next-intl";
import { Heading } from "../_components/heading";
import { Charts } from "./_components/charts";
import { LargeCards } from "./_components/large-cards";
import { SmallCards } from "./_components/small-cards";
import { RecentOrders } from "./_components/recent-orders";
import { getTranslations } from "next-intl/server";
import { Payment } from "./_components/recent-orders/columns";

const Dashboard = async () => {
  const t = await getTranslations("dashboard");
  const data = await getData();
  return (
    <div className="flex flex-col gap-y-4 h-full">
      <Heading title={t("page.title")} />
      {/* Large cards */}
      <LargeCards />
      {/* Small card */}
      <SmallCards />
      {/* Charts */}
      <Charts />
      {/* Recent orders */}
      <RecentOrders data={data} />
    </div>
  );
};
async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "b22ab121-3526-4d20-9e9a-0db7fa6110ba",
      email: "rgrebbin0@xinhuanet.com",
      amount: 57,
      status: "pending",
    },
    {
      id: "edfeb3d2-6a33-476f-b689-1252e745bb4f",
      email: "wkliemke1@sciencedirect.com",
      amount: 93,
      status: "processing",
    },
    {
      id: "5258b89b-bdbd-4b50-9a4a-bcf87c70924a",
      email: "hyelding2@cargocollective.com",
      amount: 53,
      status: "pending",
    },
    {
      id: "1ccba3c2-56b5-4ccf-8ce4-3a5a91f84da1",
      email: "adonnelly3@toplist.cz",
      amount: 11,
      status: "success",
    },
    {
      id: "9dcc2d01-2b8e-4ca9-a424-14934dbedad3",
      email: "jlarkby4@gizmodo.com",
      amount: 11,
      status: "processing",
    },
    {
      id: "0ac7c2cb-9e31-4bb0-a3af-8989864ae397",
      email: "chuckett5@usda.gov",
      amount: 100,
      status: "processing",
    },
    {
      id: "97cf8c25-e3a6-4233-95ec-ae91c65b3c96",
      email: "vkennicott6@phpbb.com",
      amount: 15,
      status: "failed",
    },
    {
      id: "d27b9397-d3fd-42c0-9593-7e68c72b47cc",
      email: "ttrinbey7@sciencedaily.com",
      amount: 50,
      status: "failed",
    },
    {
      id: "885af9d8-17b8-4df8-ad37-e69cc2adfaf4",
      email: "amaine8@simplemachines.org",
      amount: 76,
      status: "pending",
    },
    {
      id: "89578fc0-73f3-4d52-9987-cd49993ed8a5",
      email: "gchstney9@fema.gov",
      amount: 92,
      status: "pending",
    },
    {
      id: "3eb85885-4cc6-46fa-b636-b6c64a32f232",
      email: "ycricka@dailymail.co.uk",
      amount: 37,
      status: "processing",
    },
    {
      id: "87a087c0-f964-45d7-8044-fa22fbe5dc7c",
      email: "rstallworthyb@state.tx.us",
      amount: 85,
      status: "pending",
    },
    {
      id: "8ede68d9-1277-42a8-8055-290c3d886daa",
      email: "ewinspearec@jimdo.com",
      amount: 86,
      status: "success",
    },
    {
      id: "5545a315-c600-475c-a022-419dc438a1e2",
      email: "rgowmand@dell.com",
      amount: 60,
      status: "pending",
    },
    {
      id: "ebf3580c-7fec-4c5c-a223-d1072a3c31bd",
      email: "bitchinghame@china.com.cn",
      amount: 42,
      status: "pending",
    },
    {
      id: "68b24ca4-6811-4444-bd67-1b2745319abf",
      email: "sbarmbyf@slashdot.org",
      amount: 91,
      status: "pending",
    },
    {
      id: "0f582d26-6ae2-49cf-aec3-f395bff1cd5e",
      email: "falmong@acquirethisname.com",
      amount: 67,
      status: "failed",
    },
    {
      id: "56e217f2-b836-4630-97ad-654d69f5e56b",
      email: "eferrullih@istockphoto.com",
      amount: 69,
      status: "pending",
    },
    {
      id: "39f8564a-d4f2-426c-8b3f-cb0034a4463a",
      email: "cvedenichevi@microsoft.com",
      amount: 72,
      status: "processing",
    },
    {
      id: "a7be0a74-486c-4050-a52c-57382a889a1c",
      email: "vleytonj@washingtonpost.com",
      amount: 25,
      status: "success",
    },
    {
      id: "5f4d6ac8-4274-49f1-9ae4-a1324a57f75d",
      email: "rgoldupk@pbs.org",
      amount: 11,
      status: "processing",
    },
    {
      id: "fa2320bb-22a2-4ce8-b5ce-b8fd03efe38a",
      email: "ghrishanokl@webnode.com",
      amount: 69,
      status: "pending",
    },
    {
      id: "38b96a7d-c788-4fa8-92b9-f82e5452c9d4",
      email: "gwhitmarshm@printfriendly.com",
      amount: 86,
      status: "success",
    },
    {
      id: "40d11316-c5d4-48e5-8a19-6cd8a672cf21",
      email: "rbranchen@list-manage.com",
      amount: 72,
      status: "processing",
    },
    {
      id: "630d697d-b0dc-45ce-8f26-33810e6b8596",
      email: "dskermeo@marriott.com",
      amount: 7,
      status: "pending",
    },
    {
      id: "7573075d-1417-4429-acbd-b6c4da11e305",
      email: "apaigep@etsy.com",
      amount: 35,
      status: "failed",
    },
    {
      id: "d0d80d3f-c0da-48e5-9e6a-eda4542fc5f3",
      email: "nkeenlaysideq@acquirethisname.com",
      amount: 82,
      status: "processing",
    },
    {
      id: "7cdd5c3e-68d1-4708-afc7-56f18553a9c1",
      email: "kcaustonr@nature.com",
      amount: 80,
      status: "pending",
    },
    {
      id: "9b6129b9-1e7a-4407-b22e-6f64a63a21e1",
      email: "kruppels@yellowpages.com",
      amount: 18,
      status: "success",
    },
    {
      id: "e29c03a3-3675-4135-91dd-ea6d2d118021",
      email: "mtrodlert@blog.com",
      amount: 91,
      status: "success",
    },
    {
      id: "598e5291-2094-458a-991d-a62d5976daf8",
      email: "bdogu@addthis.com",
      amount: 44,
      status: "pending",
    },
    {
      id: "1d34ca3c-db1b-41a6-959d-c329de175ebc",
      email: "rclimancev@adobe.com",
      amount: 78,
      status: "processing",
    },
    {
      id: "36af9392-d408-443a-b12c-0d6895e7beab",
      email: "mfencottw@diigo.com",
      amount: 63,
      status: "failed",
    },
    {
      id: "4928aed3-dcef-47c7-960d-077859692317",
      email: "vnisex@geocities.com",
      amount: 1,
      status: "processing",
    },
    {
      id: "a63e056f-5e89-4368-89eb-a481e3d13580",
      email: "vnardrupy@mediafire.com",
      amount: 9,
      status: "success",
    },
    {
      id: "b79de712-857c-4d77-a9f0-115bc89916a1",
      email: "rkaaskooperz@amazon.co.jp",
      amount: 20,
      status: "processing",
    },
    {
      id: "5710ab1c-af46-4a77-9578-5814788ff6b6",
      email: "wdemange10@ehow.com",
      amount: 3,
      status: "pending",
    },
    {
      id: "50cac9f5-0860-4cc5-b4cf-1f133a412022",
      email: "bcaldera11@vimeo.com",
      amount: 77,
      status: "success",
    },
    {
      id: "7f603df3-8b4b-4ec9-a196-1ca4bf835cbd",
      email: "rgrene12@apache.org",
      amount: 58,
      status: "pending",
    },
    {
      id: "73bc8604-e7e3-42dc-97d2-70da6e3637c3",
      email: "gdyas13@upenn.edu",
      amount: 9,
      status: "pending",
    },
    {
      id: "4a6b30f4-fb11-484a-9c4d-dfc3b053e6e6",
      email: "ftodaro14@omniture.com",
      amount: 93,
      status: "processing",
    },
    {
      id: "37d72780-566b-4db5-83c9-d9c915411f29",
      email: "cloines15@pagesperso-orange.fr",
      amount: 3,
      status: "pending",
    },
    {
      id: "be57217b-8b13-4842-bc2c-462fd16c74cc",
      email: "tmcilvenna16@cmu.edu",
      amount: 34,
      status: "pending",
    },
    {
      id: "92e20716-b5f7-43d4-93e1-520fd607e915",
      email: "fshenfisch17@dailymail.co.uk",
      amount: 69,
      status: "failed",
    },
    {
      id: "11484711-9eb9-4592-ae1a-bcf03fd78c44",
      email: "mshortall18@yahoo.com",
      amount: 92,
      status: "failed",
    },
    {
      id: "e82ffc27-c9aa-4f79-9895-f87f96900af0",
      email: "cbeckers19@bigcartel.com",
      amount: 14,
      status: "failed",
    },
    {
      id: "de5c3506-2e88-4221-8a1c-848cab3181da",
      email: "vlintot1a@icq.com",
      amount: 80,
      status: "success",
    },
    {
      id: "93f2184d-705f-4eca-bc88-ae9e135933a1",
      email: "cdametti1b@utexas.edu",
      amount: 76,
      status: "processing",
    },
    {
      id: "542fdbb4-d2bb-4cdd-a202-165bfcf1274b",
      email: "itrahear1c@aol.com",
      amount: 56,
      status: "success",
    },
    {
      id: "1e099cce-fafb-4f68-905b-f6af12cfe99f",
      email: "rkaminski1d@unesco.org",
      amount: 41,
      status: "pending",
    },
    {
      id: "58e0733a-271a-430d-bae0-38488713952b",
      email: "iwitard1e@opensource.org",
      amount: 89,
      status: "processing",
    },
    {
      id: "60eacabd-7837-4d87-a46a-15cae2dfba87",
      email: "adegnen1f@ftc.gov",
      amount: 12,
      status: "pending",
    },
    {
      id: "ddc941ae-c855-4351-a067-85bf44aa325c",
      email: "ltatlow1g@dailymail.co.uk",
      amount: 97,
      status: "failed",
    },
    {
      id: "af1e8438-d68a-4dc6-9183-4d7fba20ca48",
      email: "nblackhall1h@google.com.br",
      amount: 33,
      status: "failed",
    },
    {
      id: "7f502272-8430-40fb-9598-ea36365e674e",
      email: "fcush1i@list-manage.com",
      amount: 49,
      status: "failed",
    },
    {
      id: "fa554521-9ee7-4ddd-9aea-1ec5c491d77d",
      email: "sdomerque1j@arizona.edu",
      amount: 16,
      status: "success",
    },
    {
      id: "42913f34-3ce9-4d12-a9e0-27cab515b1dc",
      email: "landrey1k@tmall.com",
      amount: 4,
      status: "success",
    },
    {
      id: "835e0480-a330-40a7-a444-ab72f366c387",
      email: "jcoon1l@slate.com",
      amount: 26,
      status: "success",
    },
    {
      id: "2d353c75-6795-4319-90ba-1fcf54242387",
      email: "thanscom1m@microsoft.com",
      amount: 62,
      status: "pending",
    },
    {
      id: "a0a6fff8-9d8d-4519-be13-af96e1bdd47e",
      email: "ggildea1n@mac.com",
      amount: 33,
      status: "failed",
    },
    {
      id: "f6a26b1c-dc7a-495d-b7e1-a175f95426d9",
      email: "aaprahamian1o@simplemachines.org",
      amount: 15,
      status: "pending",
    },
    {
      id: "5c8e9414-5caf-442b-857a-7f0ebf962fee",
      email: "kforber1p@wordpress.com",
      amount: 7,
      status: "success",
    },
    {
      id: "37506038-9349-43e6-a054-13fe113d2f3b",
      email: "sdominguez1q@amazonaws.com",
      amount: 25,
      status: "success",
    },
    {
      id: "2aa21620-0cb1-46bd-a4c6-1ca4e0e3ca73",
      email: "jsize1r@independent.co.uk",
      amount: 31,
      status: "pending",
    },
    {
      id: "5b169b40-1df4-45eb-8fc9-b38ca556ecbb",
      email: "bwooler1s@tuttocitta.it",
      amount: 100,
      status: "success",
    },
    {
      id: "789cb759-0138-4d66-8d6e-846677cf8624",
      email: "rwoodfin1t@prnewswire.com",
      amount: 46,
      status: "processing",
    },
    {
      id: "4e62729f-cba1-4f1c-8d0a-fe3f32f8fee7",
      email: "hhuey1u@miibeian.gov.cn",
      amount: 50,
      status: "success",
    },
    {
      id: "b21ae25c-d873-473e-b68e-f4e1719200ab",
      email: "cskillern1v@google.fr",
      amount: 23,
      status: "success",
    },
    {
      id: "4f67897b-9299-4adf-887e-c1c737e3dc81",
      email: "nmelby1w@umich.edu",
      amount: 1,
      status: "success",
    },
    {
      id: "5591aad5-71a0-45f9-8962-bc2f2c272e1e",
      email: "lwalklot1x@disqus.com",
      amount: 41,
      status: "success",
    },
    {
      id: "ce7fcc7f-8f06-4053-b947-6a32cda5f970",
      email: "gtewnion1y@yahoo.com",
      amount: 25,
      status: "processing",
    },
    {
      id: "f78fe4ed-d009-4f57-9cd6-aa104e0a5174",
      email: "wcalwell1z@ftc.gov",
      amount: 88,
      status: "pending",
    },
    {
      id: "24a595ab-b617-4b98-8748-2887f29b1488",
      email: "iholywell20@nymag.com",
      amount: 64,
      status: "processing",
    },
    {
      id: "ace3df7f-91dd-432b-87f3-5a78908be08b",
      email: "mgoncaves21@abc.net.au",
      amount: 67,
      status: "success",
    },
    {
      id: "baa63a87-f073-4437-830a-e7a4185ab0d2",
      email: "lsnoddin22@ted.com",
      amount: 7,
      status: "pending",
    },
    {
      id: "a9d95040-fe1f-45bf-aa1e-7dcb77c146bd",
      email: "rsudy23@github.io",
      amount: 16,
      status: "success",
    },
    {
      id: "36788a62-8020-40a4-8380-def085facd97",
      email: "lmessham24@nature.com",
      amount: 31,
      status: "success",
    },
    {
      id: "62c3bfd2-14d4-42f3-902c-b623b0fdde14",
      email: "sceliz25@wikipedia.org",
      amount: 8,
      status: "pending",
    },
    {
      id: "2b5aabf7-f859-4dcd-8bff-4c6ad6feeb7d",
      email: "pslaten26@ehow.com",
      amount: 78,
      status: "processing",
    },
    {
      id: "28c96fb4-ce3f-439d-954c-7b6397c2e1b7",
      email: "gwahner27@hibu.com",
      amount: 10,
      status: "pending",
    },
    {
      id: "47525fcc-0d16-47fb-9bb8-ac08e5b6a5cd",
      email: "fkment28@addthis.com",
      amount: 19,
      status: "pending",
    },
    {
      id: "9c2fa30d-04ab-4175-84ed-23516d3bd791",
      email: "jdufton29@chronoengine.com",
      amount: 88,
      status: "processing",
    },
    {
      id: "f3bc9398-0827-461e-b8f6-e831d6d29366",
      email: "ibrettoner2a@archive.org",
      amount: 65,
      status: "pending",
    },
    {
      id: "bc0a76fa-ab50-49d4-88ad-93f5fa9149a7",
      email: "stwine2b@google.com.br",
      amount: 9,
      status: "processing",
    },
    {
      id: "efefbb17-d32e-47da-ad49-4126849bf9d3",
      email: "wker2c@flickr.com",
      amount: 25,
      status: "pending",
    },
    {
      id: "39219289-6772-4f00-b5f0-8bd40cb59ebf",
      email: "aballin2d@dailymail.co.uk",
      amount: 87,
      status: "failed",
    },
    {
      id: "52469092-0da5-47a9-a001-23a60c53e64c",
      email: "lwadforth2e@admin.ch",
      amount: 45,
      status: "failed",
    },
    {
      id: "70752102-c005-438e-b02d-4b600e939c25",
      email: "mfleg2f@oracle.com",
      amount: 12,
      status: "success",
    },
    {
      id: "db134b05-0584-413e-86bd-b92c63d41978",
      email: "giannello2g@fc2.com",
      amount: 19,
      status: "pending",
    },
    {
      id: "aa3056d4-1585-4c5b-8761-cc577ee9400b",
      email: "pspoole2h@cdbaby.com",
      amount: 1,
      status: "pending",
    },
    {
      id: "74b08cb8-0ca8-4be2-853f-5cd0f526d899",
      email: "cratazzi2i@mapquest.com",
      amount: 38,
      status: "pending",
    },
    {
      id: "2e8fec79-b6a6-4ecd-b13c-c05f6a51f88a",
      email: "hwoan2j@lulu.com",
      amount: 27,
      status: "pending",
    },
    {
      id: "c3714c0e-492f-4de2-9671-aa9744e3e8bd",
      email: "mmiles2k@barnesandnoble.com",
      amount: 81,
      status: "failed",
    },
    {
      id: "228cb9f9-2798-4353-b7eb-3dfa61141359",
      email: "spawlaczyk2l@epa.gov",
      amount: 56,
      status: "processing",
    },
    {
      id: "da72e359-1f36-4c40-adbd-f3290d7f5ff7",
      email: "dscotchmer2m@ftc.gov",
      amount: 52,
      status: "failed",
    },
    {
      id: "4464f3c3-1fa0-4866-b0e5-fbe3b5a49d92",
      email: "gkilloran2n@amazonaws.com",
      amount: 20,
      status: "failed",
    },
    {
      id: "1b6f732c-900b-4940-911d-a867c8b1473a",
      email: "dstatersfield2o@foxnews.com",
      amount: 26,
      status: "processing",
    },
    {
      id: "42c08e7f-4928-4f80-8ff0-f38a6d88d398",
      email: "clittlejohn2p@theatlantic.com",
      amount: 94,
      status: "failed",
    },
    {
      id: "e8cd8e13-65be-4368-b967-c743618c6c7f",
      email: "dvanrembrandt2q@home.pl",
      amount: 42,
      status: "processing",
    },
    {
      id: "51df3338-93ee-4e8e-ae09-ec1e8bfdd06a",
      email: "gbruckshaw2r@tiny.cc",
      amount: 42,
      status: "processing",
    },
  ];
}

export default Dashboard;
