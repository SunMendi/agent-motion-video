import {execFileSync} from 'node:child_process';
import * as ffImport from 'ffmpeg-static';
import * as fpImport from 'ffprobe-static';

const asString = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'path' in (value as Record<string, unknown>)) {
    return String((value as Record<string, unknown>).path);
  }
  throw new Error('could not resolve the bundled ffmpeg/ffprobe binary');
};

const resolveBinary = (mod: unknown): string => {
  const ns = mod as {default?: unknown};
  return asString(ns.default ?? mod);
};

const ffmpegBin = resolveBinary(ffImport);
const ffprobeBin = resolveBinary(fpImport);

const runFfmpeg = (args: string[]): string =>
  execFileSync(ffmpegBin, args, {maxBuffer: 1024 * 1024 * 64}).toString();

const runFfprobe = (args: string[]): string =>
  execFileSync(ffprobeBin, args, {maxBuffer: 1024 * 1024 * 64}).toString();

/** Integrated loudness in LUFS and true peak in dBTP. */
export const measureLoudness = (file: string): {i: number; tp: number} => {
  const out = runFfmpeg([
    '-hide_banner',
    '-i', file,
    '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json',
    '-f', 'null',
    '-',
  ]);
  const match = out.match(/\{[\s\S]*?\}/);
  if (!match) throw new Error(`loudnorm did not report measurements for ${file}`);
  const json = JSON.parse(match[0]) as {input_i: string; input_tp: string};
  return {i: Number(json.input_i), tp: Number(json.input_tp)};
};

/** Constant measured gain to -14 LUFS, keeping the duration untouched. */
export const normalise = (input: string, output: string, target = -14): void => {
  const {i, tp} = measureLoudness(input);
  if (!Number.isFinite(i)) throw new Error(`could not measure the loudness of ${input}`);
  let gain = target - i;
  const headroom = -1 - tp;
  if (gain > headroom) gain = headroom;
  runFfmpeg([
    '-y',
    '-i', input,
    '-af', `volume=${gain.toFixed(2)}dB`,
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-movflags', '+faststart',
    output,
  ]);
};

export type Probe = {
  duration: number;
  width: number;
  height: number;
  videoCodec: string;
  audioCodec: string;
};

export const probeFile = (file: string): Probe => {
  const out = runFfprobe([
    '-v', 'error',
    '-show_entries', 'format=duration:stream=codec_type,codec_name,width,height',
    '-of', 'json',
    file,
  ]);
  const parsed = JSON.parse(out) as {
    format: {duration: string};
    streams: Array<{codec_type: string; codec_name: string; width?: number; height?: number}>;
  };
  const video = parsed.streams.find((s) => s.codec_type === 'video');
  const audio = parsed.streams.find((s) => s.codec_type === 'audio');
  return {
    duration: Number(parsed.format.duration),
    width: video?.width ?? 0,
    height: video?.height ?? 0,
    videoCodec: video?.codec_name ?? '',
    audioCodec: audio?.codec_name ?? '',
  };
};
