import type { NostrEvent } from 'nostr-tools/core';
import { binarySearch } from 'nostr-tools/utils';
import {
  addHai,
  compareFn,
  removeHai,
  stringToArrayWithFuro,
} from './mjlib/mj_common';
import { getShanten } from './mjlib/mj_shanten';
import { getKakanHai } from './mjlib/mj_ai';

export const sortEvents = (events: NostrEvent[]): NostrEvent[] => {
  return events.sort((a: NostrEvent, b: NostrEvent): number => {
    if (a.created_at !== b.created_at) {
      return b.created_at - a.created_at;
    }
    return b.id.localeCompare(a.id);
  });
};

export const insertEventIntoAscendingList = (
  sortedArray: NostrEvent[],
  event: NostrEvent,
): NostrEvent[] => {
  const [idx, found] = binarySearch(sortedArray, (b) => {
    if (event.id === b.id) return 0;
    if (event.created_at === b.created_at) return event.id.localeCompare(b.id);
    return event.created_at - b.created_at;
  });
  if (!found) {
    sortedArray.splice(idx, 0, event);
  }
  return sortedArray;
};

export function insertEventIntoDescendingList(
  sortedArray: NostrEvent[],
  event: NostrEvent,
): NostrEvent[] {
  const [idx, found] = binarySearch(sortedArray, (b) => {
    if (event.id === b.id) return 0;
    if (event.created_at === b.created_at) return b.id.localeCompare(event.id);
    return b.created_at - event.created_at;
  });
  if (!found) {
    sortedArray.splice(idx, 0, event);
  }
  return sortedArray;
}

export const setFuro = (
  tehai: string,
  sute: string,
  haiUsed: string,
): string => {
  tehai = removeHai(tehai, haiUsed);
  tehai = addFuro(tehai, sute + haiUsed, '<', '>');
  return tehai;
};

export const setKakan = (tehai: string, kakanHai: string): string => {
  tehai = removeHai(tehai, kakanHai);
  tehai = tehai.replace(kakanHai.repeat(3), kakanHai.repeat(4));
  return tehai;
};

export const setAnkan = (tehai: string, ankanHai: string): string => {
  tehai = removeHai(tehai, ankanHai.repeat(4));
  tehai = addFuro(tehai, ankanHai.repeat(4), '(', ')');
  return tehai;
};

const addFuro = (
  tehai: string,
  furo: string,
  s1: string,
  s2: string,
): string => {
  const sortedFuro = stringToArrayWithFuro(furo)[0];
  sortedFuro.sort(compareFn);
  const strFuro = sortedFuro.join('');
  const index = tehai.search(/[<\(]/);
  if (index >= 0) {
    return tehai.slice(0, index) + s1 + strFuro + s2 + tehai.slice(index);
  } else {
    return tehai + s1 + strFuro + s2;
  }
};

export const canTsumo = (tehai: string, atariHai: string): boolean => {
  if (atariHai === '') return false;
  //和了かどうか(シャンテン数が-1かどうか)検証する
  const shanten = getShanten(addHai(tehai, atariHai))[0];
  if (shanten !== -1) return false;
  //TODO: 役があるかどうか検証する
  return true;
};

//TODO: もっとちゃんとチェック
export const canAnkan = (
  tehai: string,
  tsumoHai: string,
  nokori: number,
): boolean => {
  if (nokori === 0) return false;
  const arAnkanHai: string[] = getAnkanHai(addHai(tehai, tsumoHai));
  if (arAnkanHai.length === 0) return false;
  return true;
};

const getAnkanHai = (hai: string): string[] => {
  const arHai: string[] = stringToArrayWithFuro(hai)[0];
  const arRet: string[] = [];
  for (const h of new Set<string>(arHai)) {
    if (arHai.filter((e) => e === h).length >= 4) arRet.push(h);
  }
  return arRet;
};

//TODO: もっとちゃんとチェック
export const canKakan = (
  tehai: string,
  tsumoHai: string,
  nokori: number,
): boolean => {
  if (nokori === 0) return false;
  const arKakanHai: string[] = getKakanHai(addHai(tehai, tsumoHai));
  if (arKakanHai.length > 0) return true;
  return false;
};

export const getEmojiUrl = (pai: string): string => {
  return awayuki_mahjong_emojis[convertEmoji(pai)];
};

const convertEmoji = (pai: string) => {
  if (pai === 'back') return 'mahjong_back';
  if (['m', 'p', 's'].includes(pai.at(1) ?? '')) {
    return `mahjong_${pai.at(1)}${pai.at(0)}`;
  } else if (pai.at(1) === 'z') {
    switch (pai.at(0)) {
      case '1':
        return 'mahjong_east';
      case '2':
        return 'mahjong_south';
      case '3':
        return 'mahjong_west';
      case '4':
        return 'mahjong_north';
      case '5':
        return 'mahjong_white';
      case '6':
        return 'mahjong_green';
      case '7':
        return 'mahjong_red';
      default:
        throw TypeError(`Unknown pai: ${pai}`);
    }
  } else {
    throw TypeError(`Unknown pai: ${pai}`);
  }
};

export const awayuki_mahjong_emojis: any = {
  mahjong_m1: 'https://awayuki.github.io/emoji/mahjong-m1.png',
  mahjong_m2: 'https://awayuki.github.io/emoji/mahjong-m2.png',
  mahjong_m3: 'https://awayuki.github.io/emoji/mahjong-m3.png',
  mahjong_m4: 'https://awayuki.github.io/emoji/mahjong-m4.png',
  mahjong_m5: 'https://awayuki.github.io/emoji/mahjong-m5.png',
  mahjong_m6: 'https://awayuki.github.io/emoji/mahjong-m6.png',
  mahjong_m7: 'https://awayuki.github.io/emoji/mahjong-m7.png',
  mahjong_m8: 'https://awayuki.github.io/emoji/mahjong-m8.png',
  mahjong_m9: 'https://awayuki.github.io/emoji/mahjong-m9.png',
  mahjong_p1: 'https://awayuki.github.io/emoji/mahjong-p1.png',
  mahjong_p2: 'https://awayuki.github.io/emoji/mahjong-p2.png',
  mahjong_p3: 'https://awayuki.github.io/emoji/mahjong-p3.png',
  mahjong_p4: 'https://awayuki.github.io/emoji/mahjong-p4.png',
  mahjong_p5: 'https://awayuki.github.io/emoji/mahjong-p5.png',
  mahjong_p6: 'https://awayuki.github.io/emoji/mahjong-p6.png',
  mahjong_p7: 'https://awayuki.github.io/emoji/mahjong-p7.png',
  mahjong_p8: 'https://awayuki.github.io/emoji/mahjong-p8.png',
  mahjong_p9: 'https://awayuki.github.io/emoji/mahjong-p9.png',
  mahjong_s1: 'https://awayuki.github.io/emoji/mahjong-s1.png',
  mahjong_s2: 'https://awayuki.github.io/emoji/mahjong-s2.png',
  mahjong_s3: 'https://awayuki.github.io/emoji/mahjong-s3.png',
  mahjong_s4: 'https://awayuki.github.io/emoji/mahjong-s4.png',
  mahjong_s5: 'https://awayuki.github.io/emoji/mahjong-s5.png',
  mahjong_s6: 'https://awayuki.github.io/emoji/mahjong-s6.png',
  mahjong_s7: 'https://awayuki.github.io/emoji/mahjong-s7.png',
  mahjong_s8: 'https://awayuki.github.io/emoji/mahjong-s8.png',
  mahjong_s9: 'https://awayuki.github.io/emoji/mahjong-s9.png',
  mahjong_east: 'https://awayuki.github.io/emoji/mahjong-east.png',
  mahjong_south: 'https://awayuki.github.io/emoji/mahjong-south.png',
  mahjong_west: 'https://awayuki.github.io/emoji/mahjong-west.png',
  mahjong_north: 'https://awayuki.github.io/emoji/mahjong-north.png',
  mahjong_white: 'https://awayuki.github.io/emoji/mahjong-white.png',
  mahjong_green: 'https://awayuki.github.io/emoji/mahjong-green.png',
  mahjong_red: 'https://awayuki.github.io/emoji/mahjong-red.png',
  mahjong_back: 'https://awayuki.github.io/emoji/mahjong-back.png',
  mahjong_stick100: 'https://awayuki.github.io/emoji/mahjong-stick100.png',
  mahjong_stick1000: 'https://awayuki.github.io/emoji/mahjong-stick1000.png',
};
