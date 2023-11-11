import { commands, RandomPicType } from "@/commands"
import { verifyInteractionRequest } from "@/discord/verify-incoming-request"
import {
  APIApplicationCommandAttachmentOption,
  APIInteractionDataOptionBase,
  ApplicationCommandOptionType,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
  
} from "discord-api-types/v10"
import { Collection } from 'discord.js';
import { NextResponse } from "next/server"
import { getRandomPic } from "./random-pic"

/**
 * Use edge runtime which is faster, cheaper, and has no cold-boot.
 * If you want to use node runtime, you can change this to `node`, but you'll also have to polyfill fetch (and maybe other things).
 *
 * @see https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes
 */
export const runtime = "edge"

// Your public key can be found on your application in the Developer Portal
const DISCORD_APP_PUBLIC_KEY = process.env.DISCORD_APP_PUBLIC_KEY

// const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//   const { name, value } = e.target;
//   setURL({value});
// };
/**
 * Handle Discord interactions. Discord will send interactions to this endpoint.
 *
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#receiving-an-interaction
 */
export async function POST(request: Request) {
  const verifyResult = await verifyInteractionRequest(request, DISCORD_APP_PUBLIC_KEY!)
  if (!verifyResult.isValid || !verifyResult.interaction) {
    return new NextResponse("Invalid request", { status: 401 })
  }
  const { interaction } = verifyResult

  if (interaction.type === InteractionType.Ping) {
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    return NextResponse.json({ type: InteractionResponseType.Pong })
  }

  if (interaction.type === InteractionType.ApplicationCommand) {
    const { name } = interaction.data

    switch (name) {
      case commands.ping.name:
        return NextResponse.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: { content: `Pong` },
        })

      case commands.invite.name:
        return NextResponse.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: `Click this link to add NextBot to your server: https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_APP_ID}&permissions=2147485696&scope=bot%20applications.commands`,
            flags: MessageFlags.Ephemeral,
          },
        })

      case commands.randompic.name:
        const { options } = interaction.data
        if (!options) {
          return new NextResponse("Invalid request", { status: 400 })
        }

        const { value } = options[0] as APIInteractionDataOptionBase<ApplicationCommandOptionType.String, RandomPicType>
        const embed = await getRandomPic(value)
        return NextResponse.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: { embeds: [embed] },
        })

        case commands.video_File.name:
          const videoOptions = interaction.data.options;
        
          if (!videoOptions) {
            return new NextResponse("Invalid request", { status: 400 });
          }

          // Assuming attachments is of type 'APIAttachment[]'
// Rest of your code

// if (attachments && attachmentSize > 0) {
//   // Assuming you want the name of the first attachment, you can access it like this
//   const attachmentName = attachments.first()?.name;
//   console.log("Attachment Name:", attachmentName);

//   // Respond with the attachment name
//   return new NextResponse("Attachment Name: " + attachmentName);
// } else {
//   // Respond if no attachments are found
//   return new NextResponse("No attachments found in the message.");
// }

        
          const videoLinkOption = videoOptions.find((opt) => opt.name === "video_link") as {
            name: "video_link";
            value: string; // Ensure TypeScript recognizes the value property as a string
          };
        
          const languageOption = videoOptions.find((opt) => opt.name === "language") as {
            name: "language";
            value: string; // Ensure TypeScript recognizes the value property as a string
          };
        
          if (!videoLinkOption || !languageOption) {
            return new NextResponse("Invalid request", { status: 400 });
          }
        
          const videoLink = videoLinkOption.value;
          const language = languageOption.value;
        
          // Now you have 'videoLink', 'language', and 'attachmentName' available for further processing.
          // You can add your code to process the video URL, language, and attachment name here.
        
          return NextResponse.json({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: { content: `Received video URL: ${videoLink}, language: ${language}` },
          });
        

        default:
    }
  }

  return new NextResponse("Unknown command", { status: 400 })
}
