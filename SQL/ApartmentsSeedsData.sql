-- 1. 确保字段存在 (使用前端代码里对应的名字)
ALTER TABLE apartments 
ADD COLUMN IF NOT EXISTS cover_image TEXT,  -- 对应代码里的 cover_image
ADD COLUMN IF NOT EXISTS location TEXT,     -- 对应代码里的 location
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS rating_avg NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;

-- 2. 清空旧数据 (ID 重置)
TRUNCATE TABLE apartments RESTART IDENTITY CASCADE;

-- 3. 插入数据 (注意：这里把 address 放进了 location 字段，把 image_url 放进了 cover_image 字段)
INSERT INTO apartments (name, cover_image, location, tags, rating_avg, rating_count)
VALUES
  (
    'Aurora Melbourne Central', 
    '/aurora.jpg', 
    '228 La Trobe St, Melbourne', 
    ARRAY['近RMIT', '电梯慢', '无敌景'], 
    0, 0
  ),
  (
    'Victoria One', 
    '/victoria-one.jpg', 
    '462 Elizabeth St, Melbourne', 
    ARRAY['户型小', '位置好', '很多留学生'], 
    0, 0
  ),
  (
    'Avant', 
    '/avant.jpg', 
    '60 A''Beckett St, Melbourne', 
    ARRAY['外墙酷', '近维妈', '网红楼'], 
    0, 0
  ),
  (
    'Swanston Central', 
    '/swanstoncentral.jpeg', 
    '168 Victoria St, Carlton', 
    ARRAY['地标建筑', '设施豪华', '近墨大'], 
    0, 0
  ),
  (
    'Empire Melbourne', 
    '/empire.jpg', 
    '81 A''Beckett St, Melbourne', 
    ARRAY['市中心', '交通便利', '健身房'], 
    0, 0
  ),
  (
    'Eq. Tower', 
    '/eq-tower.jpg', 
    '135 A''Beckett St, Melbourne', 
    ARRAY['近市场', '高层景观', '公共设施佳'], 
    0, 0
  ),
  (
    'Light House', 
    '/lighthouse.jpg', 
    '450 Elizabeth St, Melbourne', 
    ARRAY['采光好', '紫色楼', '近超市'], 
    0, 0
  ),
  (
    'Uno Melbourne', 
    '/uno.jpg', 
    '111 A''Beckett St, Melbourne', 
    ARRAY['全新交付', '近Central', '设计现代'], 
    0, 0
  ),
  (
    'Scape Swanston', 
    '/Scape_Swanston.jpg', 
    '393 Swanston St, Melbourne', 
    ARRAY['学生公寓', '包含Bill', 'RMIT对面'], 
    0, 0
  ),
  (
    'UniLodge Lincoln House', 
    '/unilodge-lincoln-house.jpg', 
    '125 Bouverie St, Carlton', 
    ARRAY['近墨大', '社交氛围好', '工业风'], 
    0, 0
  ),
  (
    'Iglu Melbourne City', 
    NULL, 
    '229 Franklin St, Melbourne', 
    ARRAY['包早餐', '设施新', '社交丰富'], 
    0, 0
  ),
  (
    'Yugo University Square', 
    NULL, 
    '198 Pelham St, Carlton', 
    ARRAY['近墨大', '学习氛围好', '设施全'], 
    0, 0
  ),
  (
    'Journal Student Living', 
    NULL, 
    '500 Elizabeth St, Melbourne', 
    ARRAY['文艺风', '花园大', '社区感强'], 
    0, 0
  ),
  (
    'The Switch', 
    NULL, 
    '383 La Trobe St, Melbourne', 
    ARRAY['维妈旁', '科技感', '共享生活'], 
    0, 0
  ),
  (
    'Melbourne Grand', 
    NULL, 
    '560 Lonsdale St, Melbourne', 
    ARRAY['近南十字星', '高层', '现代风格'], 
    0, 0
  );