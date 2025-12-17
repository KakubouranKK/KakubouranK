
import { Chapter, Question } from './types';

const chapter1Titles = [
  "舌吻", "裸拥", "挠痒", "被舔乳头", "乳交", 
  "指交", "被口", "口交", "种草莓", "咬痕", 
  "体外玩具", "入体玩具", "情趣内衣", "强制爱", "互看自慰", 
  "命令自慰", "边缘控制", "颜射", "吞精", "体内射精"
];

const chapter2Titles = [
  "传教士", "后入", "女上位", "站立", "趴下", 
  "69", "深喉", "后花园", "坐脸", "侧入", 
  "抱操", "野外", "车内", "浴室", "客厅", 
  "镜子", "遥控/穿戴", "衣帽间", "书房", "沙发", 
  "哥哥/妹妹", "主人", "爸爸", "老公/老婆", "他人/扮演"
];

const chapter3Titles = [
  "宠物", "性奴", "寝取", "足交", "潮吹", 
  "失禁", "真丝", "皮具", "毛发", "项圈", 
  "铃铛", "口球", "肛塞", "眼罩", "乳夹", 
  "口塞", "滴蜡", "乳责", "扇耳光", "打屁股", 
  "跪下", "束缚", "绳缚", "M腿", "SweetTalk", 
  "侮辱性语言", "涂鸦写字", "强制高潮", "性窒息", "拍视频", 
  "露出", "超深入/子宫口", "NTR", "3/群P", "纯爱"
];

const createQuestions = (titles: string[], category: string, startId: number): Question[] => {
  return titles.map((title, index) => ({
    id: startId + index,
    text: title,
    category: category
  }));
};

const generateChapters = (): Chapter[] => {
  const c1 = createQuestions(chapter1Titles, "开胃菜", 1);
  const c2 = createQuestions(chapter2Titles, "体位场所及角色", 21);
  const c3 = createQuestions(chapter3Titles, "BDSM", 46);

  return [
    {
      id: 1,
      title: "章节一：开胃菜",
      description: "探索基础的亲密接触与前戏偏好。",
      questions: c1
    },
    {
      id: 2,
      title: "章节二：体位、场所及角色",
      description: "探索您在环境、姿势以及身份扮演上的倾向。",
      questions: c2
    },
    {
      id: 3,
      title: "章节三：BDSM",
      description: "深入探索权力动态、感官刺激与特殊的性癖好。",
      questions: c3
    }
  ];
};

export const CHAPTERS = generateChapters();
export const TOTAL_QUESTIONS = 80;
