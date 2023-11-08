/**
 * Share command metadata from a common spot to be used for both runtime
 * and registration.
 *
 * @see https://discord.com/developers/docs/interactions/application-commands#registering-a-command
 */
/// <reference types="discord-api-types/v10" />

import { ApplicationCommandType } from "discord-api-types/v10"

export const PING_COMMAND = {
  name: "ping",
  description: "Ping pong! I'll respond with pong.",
} as const

export const INVITE_COMMAND = {
  name: "invite",
  description: "Get an invite link to add this bot to your server",
} as const

export type RandomPicType = "cat" | "dog" | "picsum"
export const RANDOM_PIC_COMMAND = {
  name: "randompic",
  description: "Get a random picture",
  options: [
    {
      name: "type",
      description: "What type of picture would you like?",
      type: ApplicationCommandType.Message,
      required: true,
      choices: [
        { name: "cat", value: "cat" },
        { name: "dog", value: "dog" },
        { name: "generic", value: "picsum" },
      ],
    },
  ],
} as const

// Define the new command metadata
export const VIDEO_PROCESS_COMMAND = {
  name: "processvideo",
  description: "Process a video's audio in the desired language",
  options: [
    {
      name: "video_link",
      description: "Link to the video to be processed",
      type: ApplicationCommandType.ChatInput, // Adjust the type as needed
      required: true,
    },    
    {
      name: "language",
      description: "What type of language would you dub in?",
      type: ApplicationCommandType.Message,
      required: true,
      choices: [
        {
          name: 'English',
          value: 'en-US'
        },
        {
          name: 'Mandarin Chinese',
          value: 'zh-CN'
        },
        {
          name: 'Spanish',
          value: 'es'
        },
        {
          name: 'Hindi',
          value: 'hi'
        }
      ],
    },
  ],
} as const

export const commands = {
  ping: PING_COMMAND,
  invite: INVITE_COMMAND,
  randompic: RANDOM_PIC_COMMAND,
  video_File: VIDEO_PROCESS_COMMAND,  
} as const
