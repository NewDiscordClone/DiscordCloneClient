import Chat from "./Chat";

type Channel = Chat & {
    id: number | undefined;
    title: string;
}
export default Channel;