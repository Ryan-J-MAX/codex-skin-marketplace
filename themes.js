// ========================================
// Codex Skin Workshop — Theme Data
// ========================================
// 添加新主题只需在这里加一条记录

// 安装脚本下载链接 (Mac)
const INSTALL_SCRIPT_URL = 'https://github.com/Ryan-J-MAX/Codex-Skin-Workshop/releases/download/v1.0.0/Codex-Skin-Workshop.zip';

// 主题 zip 包下载链接模板
const THEME_ZIP_URL = 'https://github.com/Ryan-J-MAX/Codex-Skin-Workshop/releases/download/v1.0.0/theme-';

// 图片版本号，更新时递增
const IMG_VER = '4';

const themes = [
  {
    id: "cyberpunk-city",
    name: "赛博之城",
    author: "Ryan",
    description: "赛博朋克城市夜景，霓虹灯管，代码在数字街道间穿行",
    tags: ["dark", "cyberpunk"],
    preview: "assets/img/cyberpunk-city.jpg?v=" + IMG_VER,
    download: INSTALL_SCRIPT_URL,
    downloads: 328,
    featured: true
  },
  {
    id: "cherry-blossom",
    name: "樱吹雪",
    author: "Ryan",
    description: "淡粉樱花背景，适合春天写代码",
    tags: ["light", "anime", "minimal"],
    preview: "assets/img/cherry-blossom.jpg?v=" + IMG_VER,
    download: INSTALL_SCRIPT_URL,
    downloads: 256
  },
  {
    id: "ocean-deep",
    name: "深海暗流",
    author: "Ryan",
    description: "深蓝海洋渐变，安静专注的氛围",
    tags: ["dark", "minimal"],
    preview: "assets/img/ocean-deep.jpg?v=" + IMG_VER,
    download: INSTALL_SCRIPT_URL,
    downloads: 189
  },
  {
    id: "aurora-night",
    name: "极光之夜",
    author: "Ryan",
    description: "北极光在天际舞动，紫绿交织的梦幻天空",
    tags: ["dark", "minimal"],
    preview: "assets/img/aurora-night.jpg?v=" + IMG_VER,
    download: INSTALL_SCRIPT_URL,
    downloads: 145
  },
  {
    id: "zen-mountain",
    name: "云雾山居",
    author: "Ryan",
    description: "水墨山水，远山云雾，写代码如隐居",
    tags: ["light", "minimal"],
    preview: "assets/img/zen-mountain.jpg?v=" + IMG_VER,
    download: INSTALL_SCRIPT_URL,
    downloads: 112
  },
  {
    id: "galaxy-space",
    name: "银河核心",
    author: "Ryan",
    description: "深空星云，紫色银河，宇宙级沉浸感",
    tags: ["dark", "minimal"],
    preview: "assets/img/galaxy-space.jpg?v=" + IMG_VER,
    download: INSTALL_SCRIPT_URL,
    downloads: 176
  },
  {
    id: "neon-noir",
    name: "霓虹暗夜",
    author: "Ryan",
    description: "深紫暗黑底色，霓虹光效，代码像在赛博城市里飞行",
    tags: ["dark", "cyberpunk"],
    preview: "assets/img/neon-noir.jpg?v=" + IMG_VER,
    download: INSTALL_SCRIPT_URL,
    downloads: 267
  },
  {
    id: "sunset-gold",
    name: "落日熔金",
    author: "Ryan",
    description: "暖橙金色渐变，黄昏时分的温暖色调",
    tags: ["light", "minimal"],
    preview: "assets/img/sunset-gold.jpg?v=" + IMG_VER,
    download: INSTALL_SCRIPT_URL,
    downloads: 134
  },
  {
    id: "hacker-matrix",
    name: "黑客帝国",
    author: "Ryan",
    description: "经典绿色代码雨，Matrix 风格",
    tags: ["dark", "cyberpunk"],
    preview: "assets/img/hacker-matrix.jpg?v=" + IMG_VER,
    download: INSTALL_SCRIPT_URL,
    downloads: 312
  },
  {
    id: "sakura-night",
    name: "夜樱",
    author: "Ryan",
    description: "暗夜樱花，深蓝底色配粉色花瓣",
    tags: ["dark", "anime"],
    preview: "assets/img/sakura-night.jpg?v=" + IMG_VER,
    download: INSTALL_SCRIPT_URL,
    downloads: 134
  },
  {
    id: "vaporwave",
    name: "蒸汽波",
    author: "Ryan",
    description: "复古合成波，粉色 + 青色，自带 BGM 的编码体验",
    tags: ["dark", "cyberpunk"],
    preview: "assets/img/vaporwave.jpg?v=" + IMG_VER,
    download: INSTALL_SCRIPT_URL,
    downloads: 210
  },
  {
    id: "autumn-maple",
    name: "枫林晚",
    author: "Ryan",
    description: "暖秋枫叶红，写代码也要有温度",
    tags: ["light", "minimal"],
    preview: "assets/img/autumn-maple.jpg?v=" + IMG_VER,
    download: INSTALL_SCRIPT_URL,
    downloads: 89
  }
];