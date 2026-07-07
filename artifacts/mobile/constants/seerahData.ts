export interface SeerahStory {
  id: string;
  title: string;
  arabicTitle: string;
  urduTitle: string;
  category: 'Prophets' | 'Seerah' | 'Companions' | 'Miracles' | 'Character';
  content: string;
  moral: string;
  reference: string;
}

export const SEERAH_STORIES: SeerahStory[] = [
  {
    id: 's1', title: 'The Birth of the Prophet ﷺ', arabicTitle: 'مولد النبي ﷺ', urduTitle: 'آپ ﷺ کی ولادت',
    category: 'Seerah',
    content: 'The Prophet Muhammad ﷺ was born in Makkah on the 12th of Rabi al-Awwal, in the Year of the Elephant (570 CE). His father, Abdullah, had passed away before his birth. He was born into the noble Quraysh tribe, in the clan of Banu Hashim. His mother, Aminah bint Wahb, reported seeing a great light at the time of his birth that illuminated the palaces of Syria. He was named Muhammad, meaning "The Praised One." His birth was a turning point in human history, as Allah had chosen him to be the final messenger to all of mankind.',
    moral: 'Allah chooses His messengers with divine wisdom. The Prophet ﷺ was born in humble circumstances yet would change the world forever.',
    reference: 'Sirah Ibn Hisham',
  },
  {
    id: 's2', title: 'The First Revelation', arabicTitle: 'أول الوحي', urduTitle: 'پہلی وحی',
    category: 'Seerah',
    content: 'At the age of 40, Muhammad ﷺ was meditating in the Cave of Hira when the angel Jibreel (AS) appeared and commanded him: "Read!" He replied: "I cannot read." Jibreel embraced him tightly three times and each time repeated the command. Finally, the first verses of the Quran were revealed: "Read in the name of your Lord who created. Created man from a clinging substance. Read, and your Lord is the Most Generous." Shaken, the Prophet ﷺ rushed home to his wife Khadijah (RA), who wrapped him in a cloak and comforted him. She then took him to her cousin Waraqa ibn Nawfal, who confirmed that he had received the same angel as Prophet Musa (AS).',
    moral: 'The beginning of divine revelation was a moment of trust and comfort in marriage. Khadijah\'s support teaches us the importance of a supportive spouse.',
    reference: 'Bukhari 3, Muslim 160',
  },
  {
    id: 's3', title: 'The Hijra to Medina', arabicTitle: 'الهجرة إلى المدينة', urduTitle: 'مدینہ کی ہجرت',
    category: 'Seerah',
    content: 'After years of persecution in Makkah, Allah commanded the Prophet ﷺ to migrate to Medina (then called Yathrib). The Quraysh plotted to assassinate him, but the Prophet ﷺ left his cousin Ali (RA) in his bed and slipped away with his closest companion Abu Bakr (RA). As they hid in the Cave of Thawr, the Quraysh searched nearby. Abu Bakr whispered: "If they look down at their feet, they will see us." The Prophet ﷺ replied with complete confidence: "What do you think of two who have Allah as their third?" A spider had woven its web across the cave entrance, convincing the pursuers that no one had entered. The migration marked the beginning of the Islamic calendar.',
    moral: 'Trust in Allah completely. When you do your part and have tawakkul, Allah provides miraculous help from unexpected sources.',
    reference: 'Bukhari 4663',
  },
  {
    id: 's4', title: 'The Treaty of Hudaybiyya', arabicTitle: 'صلح الحديبية', urduTitle: 'صلح حدیبیہ',
    category: 'Seerah',
    content: 'In 6 AH, the Prophet ﷺ set out with 1,400 companions to perform Umrah. The Quraysh blocked them at Hudaybiyya. The resulting treaty appeared unfavorable to the Muslims - they would return that year, and any Quraysh who came to the Muslims without their guardian\'s permission would be returned, but not vice versa. When Umar (RA) questioned the treaty\'s terms, the Prophet ﷺ insisted. Allah revealed: "Indeed, We have granted you a clear conquest" (48:1). Within two years, Makkah was opened, and the treaty had allowed Islam to spread peacefully. What seemed like a defeat was actually a divine victory.',
    moral: 'Trust the Prophet\'s ﷺ wisdom even when circumstances seem unfavorable. What appears to be loss may be Allah\'s greatest victory.',
    reference: 'Bukhari 2731, Quran 48:1',
  },
  {
    id: 's5', title: 'The Conquest of Makkah', arabicTitle: 'فتح مكة', urduTitle: 'فتح مکہ',
    category: 'Seerah',
    content: 'In 8 AH, the Prophet ﷺ marched to Makkah with 10,000 companions after the Quraysh violated the Treaty of Hudaybiyya. The city surrendered without significant bloodshed. The Prophet ﷺ entered Makkah humbly, with his head bowed in gratitude to Allah, mounted on his camel. He circled the Kaaba and destroyed the 360 idols, reciting: "Truth has come, and falsehood has departed" (17:81). Then he gathered the Quraysh, who had persecuted him for years, and asked: "What do you think I will do with you?" They replied: "A generous brother and the son of a generous brother." He declared: "Go, for you are free." This general amnesty was unprecedented in history.',
    moral: 'Forgiveness is strength, not weakness. When Allah gives you power over your enemies, the highest virtue is pardoning them.',
    reference: 'Ibn Hisham, Sirah; Quran 17:81',
  },
  {
    id: 's6', title: 'Abu Bakr Al-Siddiq', arabicTitle: 'أبو بكر الصديق', urduTitle: 'ابوبکر صدیق',
    category: 'Companions',
    content: 'Abu Bakr (RA) was the closest companion of the Prophet ﷺ and the first adult male to accept Islam. When others doubted the Night Journey (Isra wal Miraj), Abu Bakr immediately believed, earning the title "As-Siddiq" (The Truthful). He spent his entire wealth in the early years, freeing enslaved believers like Bilal (RA). When the Prophet ﷺ passed away, many companions were overwhelmed with grief, including Umar (RA). Abu Bakr addressed the crowd with the famous words: "Whoever worshipped Muhammad, Muhammad has died. Whoever worshipped Allah, Allah is alive and does not die." He became the first Caliph and preserved the Muslim community during its most vulnerable hour.',
    moral: 'True loyalty to Allah and His Prophet ﷺ brings wisdom in times of crisis. Abu Bakr\'s unwavering faith stabilized the entire Ummah.',
    reference: 'Bukhari, Sirah',
  },
  {
    id: 's7', title: 'Bilal ibn Rabah', arabicTitle: 'بلال بن رباح', urduTitle: 'بلال بن رباح',
    category: 'Companions',
    content: 'Bilal (RA) was an Ethiopian slave owned by Umayyah ibn Khalaf. When he accepted Islam, his master tortured him mercilessly, placing a heavy rock on his chest in the burning desert heat. Yet Bilal repeatedly said: "Ahad! Ahad!" (One! One!), affirming the Oneness of Allah. Abu Bakr (RA) bought and freed him. Bilal became one of the closest companions of the Prophet ﷺ and was honored as the first Muezzin of Islam. When Makkah was conquered, the Prophet ﷺ asked Bilal to climb the roof of the Kaaba and give the call to prayer - the greatest honor, given to a freed slave from Ethiopia. His beautiful voice still echoes in the hearts of Muslims.',
    moral: 'Allah raises the oppressed. Race and social status are meaningless before Allah; only piety matters.',
    reference: 'Sirah Ibn Hisham',
  },
  {
    id: 's8', title: 'The Character of the Prophet ﷺ', arabicTitle: 'خلق النبي ﷺ', urduTitle: 'آپ ﷺ کے اخلاق',
    category: 'Character',
    content: 'Aisha (RA) was once asked about the character of the Prophet ﷺ. She replied: "His character was the Quran." He never struck a servant or woman, never took revenge for personal wrongs, and was always gentle. He would sit with the poor and needy. He helped with household chores, mended his own sandals, and sewed his own clothes. He would smile often and greeted everyone with warmth. Even his enemies acknowledged his noble character. Abu Sufiyan, before accepting Islam, said to Heraclius the Byzantine emperor: "He commands prayer, honesty, chastity, and maintaining family ties." The Prophet\'s ﷺ character was his greatest miracle.',
    moral: 'The Quran is meant to be lived, not just recited. Embody its teachings in your daily interactions.',
    reference: 'Muslim 746, Bukhari',
  },
  {
    id: 's9', title: 'Umar ibn al-Khattab\'s Conversion', arabicTitle: 'إسلام عمر بن الخطاب', urduTitle: 'عمر کا اسلام',
    category: 'Companions',
    content: 'Umar ibn al-Khattab (RA) was one of the fiercest opponents of early Muslims. One day, he set out with his sword drawn, intending to kill the Prophet ﷺ. On the way, he was told his sister Fatima and her husband had accepted Islam. He went to their home, heard Quran being recited from Surah Ta-Ha, and was moved by its words. He asked to read it, made wudu, and was profoundly impacted. He went directly to the Prophet ﷺ and declared his faith. The news of his conversion filled the Muslims with joy. The Prophet ﷺ said: "O Allah, strengthen Islam with whichever of the two Umars is more beloved to You." Umar became one of Islam\'s greatest leaders.',
    moral: 'The Quran has the power to transform the hardest hearts. Never lose hope in someone\'s guidance - Umar went from persecutor to protector.',
    reference: 'Sirah Ibn Hisham, Ibn Kathir',
  },
  {
    id: 's10', title: 'Uwais al-Qarni - The Unknown Saint', arabicTitle: 'أويس القرني', urduTitle: 'اویس قرنی',
    category: 'Companions',
    content: 'Uwais al-Qarni (RA) was a Yemeni man who accepted Islam but could never meet the Prophet ﷺ because he cared for his elderly, blind mother. The Prophet ﷺ told his companions: "There is a man in Yemen named Uwais. He has a mother who is ill and he serves her. If he makes an oath by Allah, Allah will fulfill it. If any of you meet him, ask him to seek forgiveness for you." Umar and Ali (RA) searched for him after the Prophet\'s death. When they found him and asked for his intercession, Uwais was reluctant, not knowing why they sought him. His love for his mother and sincere devotion earned him divine recognition without him even knowing it.',
    moral: 'Serving your parents with sincerity can elevate you to heights that public worship cannot. Unseen deeds have great value with Allah.',
    reference: 'Muslim 2542',
  },
  {
    id: 's11', title: 'The Story of Isra and Mi\'raj', arabicTitle: 'الإسراء والمعراج', urduTitle: 'اسراء اور معراج',
    category: 'Miracles',
    content: 'In a single night, the Prophet ﷺ was taken from Makkah to Jerusalem (Al-Aqsa), then ascended through the heavens. Along the way, he met previous prophets: Adam (AS) in the first heaven, Yahya and Isa (AS) in the second, Yusuf (AS) in the third, Idris (AS) in the fourth, Harun (AS) in the fifth, Musa (AS) in the sixth, and Ibrahim (AS) in the seventh. He was then taken beyond to receive the gift of five daily prayers - originally fifty, reduced to five through Musa\'s (AS) advice to ask for reduction. When the Prophet ﷺ returned and told the Quraysh, they laughed and called it impossible. But those who had seen Jerusalem confirmed his description perfectly.',
    moral: 'The five daily prayers are a direct gift from Allah to the Prophet ﷺ and his Ummah - a daily ascension for every believer.',
    reference: 'Bukhari 3207, Muslim 163',
  },
  {
    id: 's12', title: 'Khadijah bint Khuwaylid', arabicTitle: 'خديجة بنت خويلد', urduTitle: 'خدیجہ بنت خویلد',
    category: 'Companions',
    content: 'Khadijah (RA) was a successful businesswoman who hired the young Muhammad ﷺ to lead her trade caravans. She was impressed by his honesty and noble character and proposed marriage to him. She was 40 and he was 25. She was the first person to believe in him when he received revelation, the first Muslim. When the Prophet ﷺ returned trembling from the cave, she said: "By Allah, Allah will never disgrace you. You uphold family ties, help the poor, serve guests, and support people in their hardships." She spent her entire fortune in support of Islam. She died before the Hijra, and the Prophet ﷺ never ceased mentioning her with love and gratitude.',
    moral: 'A righteous spouse who believes in your potential and supports you through hardship is one of the greatest gifts from Allah.',
    reference: 'Bukhari 3, Sirah',
  },
];
