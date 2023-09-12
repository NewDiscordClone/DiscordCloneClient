import csx from "classnames";
import styles from "./Server.module.scss";

type Props = {
    isSelected: boolean;
    onServerClick: (serverId: string | undefined) => void;
}
const PrivateServerIcon = ({isSelected, onServerClick}: Props) => {
    return (
        <div className={csx(styles.serverIconContainer, [styles.serverMainIcon], {[styles.selected]: isSelected})}
             onClick={() => onServerClick(undefined)}>
            <img src={"DiscordLogo.png"}
                 alt={"MainButton"}
            />
        </div>
    );
};
export default PrivateServerIcon;