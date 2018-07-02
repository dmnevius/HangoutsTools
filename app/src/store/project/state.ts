import Channel from '../../classes/channel';
import ChannelLike from '../../classes/channelLike';

export default interface ProjectState extends ChannelLike {
  channels: {
    [id: string]: Channel;
  };
  myID?: string;
}
