export interface Riddle {
  id: number;
  diff: string;
  diffClass: 'murder' | 'labyrinth' | 'extreme' | 'final';
  body: string;
  question: string;
  answers: string[];
  hint: string;
  explain: string;
}

export const RIDDLES_CLASSIC: Riddle[] = [
  {
    id: 1,
    diff: "Easy",
    diffClass: "extreme",
    body: `<div class="scene-block">
      <div class="scene-label">The Observation</div>
      <p class="scene-text">I have cities, but no houses. I have mountains, but no trees. I have water, but no fish.</p>
    </div>`,
    question: "What am I?",
    answers: ["map", "a map"],
    hint: "I represent the world but contain none of its life.",
    explain: "A map shows geographical features but is not the physical world itself."
  },
  {
    id: 2,
    diff: "Medium",
    diffClass: "extreme",
    body: `<div class="scene-block">
      <div class="scene-label">The Paradox</div>
      <p class="scene-text">The more of this there is, the less you see.</p>
    </div>`,
    question: "What is it?",
    answers: ["darkness", "dark"],
    hint: "It's the absence of light.",
    explain: "As darkness increases, visibility decreases."
  },
  {
    id: 3,
    diff: "Medium",
    diffClass: "extreme",
    body: `<div class="scene-block">
      <div class="scene-label">The Lifecycle</div>
      <p class="scene-text">I am tall when I am young, and I am short when I am old.</p>
    </div>`,
    question: "What am I?",
    answers: ["candle", "a candle", "pencil", "a pencil"],
    hint: "I consume myself to provide light or record thoughts.",
    explain: "A candle melts down as it burns, and a pencil gets shorter as it's sharpened."
  },
  {
    id: 4,
    diff: "Medium",
    diffClass: "extreme",
    body: `<div class="scene-block">
      <div class="scene-label">The Silent Speaker</div>
      <p class="scene-text">I have no mouth but I always reply when you speak to me.</p>
    </div>`,
    question: "What am I?",
    answers: ["echo", "an echo"],
    hint: "I am a reflection of sound.",
    explain: "An echo repeats whatever sound is made near it."
  },
  {
    id: 5,
    diff: "Hard",
    diffClass: "extreme",
    body: `<div class="scene-block">
      <div class="scene-label">The Weightless Burden</div>
      <p class="scene-text">What is so fragile that saying its name breaks it?</p>
    </div>`,
    question: "What is it?",
    answers: ["silence"],
    hint: "The very act of speaking destroys it.",
    explain: "Silence is the absence of sound; speaking breaks that absence."
  },
  {
    id: 6,
    diff: "Hard",
    diffClass: "extreme",
    body: `<div class="scene-block">
      <div class="scene-label">The Traveler</div>
      <p class="scene-text">What can travel around the world while staying in a corner?</p>
    </div>`,
    question: "What is it?",
    answers: ["stamp", "a stamp"],
    hint: "I am attached to letters.",
    explain: "A postage stamp stays in the corner of an envelope as it travels globally."
  },
  {
    id: 7,
    diff: "Hard",
    diffClass: "extreme",
    body: `<div class="scene-block">
      <div class="scene-label">The Constant</div>
      <p class="scene-text">What is always in front of you but can’t be seen?</p>
    </div>`,
    question: "What is it?",
    answers: ["future", "the future"],
    hint: "It hasn't happened yet.",
    explain: "The future is always ahead of us in time but is not yet visible."
  },
  {
    id: 8,
    diff: "Extreme",
    diffClass: "extreme",
    body: `<div class="scene-block">
      <div class="scene-label">The Thief</div>
      <p class="scene-text">I follow you all day long, but when the night or rain comes, I am gone.</p>
    </div>`,
    question: "What am I?",
    answers: ["shadow", "your shadow", "a shadow"],
    hint: "I need light to exist, but I am not light.",
    explain: "A shadow is formed when an object blocks light, so it disappears in darkness or diffuse light."
  },
  {
    id: 9,
    diff: "Extreme",
    diffClass: "extreme",
    body: `<div class="scene-block">
      <div class="scene-label">The Architect</div>
      <p class="scene-text">I build bridges of silver and paths of gold, but I have no hands to hold.</p>
    </div>`,
    question: "What am I?",
    answers: ["sunlight", "the sun", "moonlight", "the moon"],
    hint: "I reflect off the water's surface.",
    explain: "Sunlight or moonlight reflecting on water creates shimmering paths."
  },
  {
    id: 10,
    diff: "Extreme",
    diffClass: "extreme",
    body: `<div class="scene-block">
      <div class="scene-label">The Void</div>
      <p class="scene-text">What has a thumb and four fingers, but is not alive?</p>
    </div>`,
    question: "What is it?",
    answers: ["glove", "a glove"],
    hint: "It's a piece of clothing for your hand.",
    explain: "A glove is shaped like a hand but is inanimate."
  },
  {
    id: 11,
    diff: "Insane",
    diffClass: "extreme",
    body: `<div class="scene-block">
      <div class="scene-label">The Heartless</div>
      <p class="scene-text">I have a neck but no head, two arms but no hands.</p>
    </div>`,
    question: "What am I?",
    answers: ["shirt", "a shirt"],
    hint: "You wear me every day.",
    explain: "A shirt has a neck opening and sleeves (arms) but no physical head or hands."
  },
  {
    id: 12,
    diff: "Insane",
    diffClass: "extreme",
    body: `<div class="scene-block">
      <div class="scene-label">The Final Gate</div>
      <p class="scene-text">I can be cracked, made, told, and played.</p>
    </div>`,
    question: "What am I?",
    answers: ["joke", "a joke"],
    hint: "I am meant to make people laugh.",
    explain: "You can crack a joke, make a joke, tell a joke, and play a joke."
  }
];

export const RIDDLES_HORROR: Riddle[] = [
  {
    "id": 1,
    "diff": "Extreme",
    "diffClass": "murder",
    "body": "<div class=\"scene-block\">\n      <div class=\"scene-label\">The Architect's Demise</div>\n      <p class=\"scene-text\">An architect was found dead in his newly designed, perfectly soundproof, windowless vault. The heavy steel door was locked from the inside. There are no secret passages. He died of asphyxiation, but the room has enough air to last a week, and he was only in there for an hour. The only things in the room are his body, a broken hourglass, and a large block of dry ice.</p>\n      <ul class=\"clues-list\">\n        <li>The room was completely sealed.</li>\n        <li>Dry ice sublimates into gas.</li>\n        <li>The gas is heavier than air and displaces oxygen.</li>\n      </ul>\n    </div>",
    "question": "How did the architect die without using up the room's oxygen, and why was the door locked from the inside?",
    "answers": [
      "dry ice",
      "carbon dioxide",
      "co2",
      "suffocated by dry ice",
      "sublimation"
    ],
    "hint": "What happens to dry ice when it melts in a sealed room?",
    "explain": "The architect brought a large block of dry ice into the sealed vault. As it sublimated, it rapidly filled the room with carbon dioxide, displacing the breathable oxygen and causing asphyxiation. He locked the door himself before the effects took hold."
  },
  {
    "id": 2,
    "diff": "Extreme",
    "diffClass": "murder",
    "body": "<div class=\"scene-block\">\n      <div class=\"scene-label\">The Poisoned Chalice</div>\n      <p class=\"scene-text\">Two explorers find a tomb. They drink from the same cursed chalice, filled with the same wine. One dies instantly, the other lives. The survivor didn't take an antidote and the poison was definitely in the wine.</p>\n      <ul class=\"clues-list\">\n        <li>The poison was in the ice cubes.</li>\n        <li>The survivor drank quickly.</li>\n        <li>The victim drank slowly.</li>\n      </ul>\n    </div>",
    "question": "Why did only one explorer die if they drank the exact same poisoned wine?",
    "answers": [
      "ice",
      "ice cubes",
      "the ice",
      "poison was in the ice",
      "ice melted"
    ],
    "hint": "Temperature and time play a crucial role in the poisoning.",
    "explain": "The poison was frozen inside the ice cubes. The survivor drank their wine quickly before the ice could melt. The victim drank slowly, allowing the poisoned ice to melt into the wine."
  },
  {
    "id": 3,
    "diff": "Mind-Bending",
    "diffClass": "extreme",
    "body": "<div class=\"scene-block\">\n      <div class=\"scene-label\">The Midnight Caller</div>\n      <p class=\"scene-text\">A woman lives alone in a remote cabin. One night, she hears a knock. She looks through the peephole and sees a stranger. She immediately calls the police and says, 'There is a murderer at my door.' She has never seen this person before, and they are holding no weapons.</p>\n      <ul class=\"clues-list\">\n        <li>The cabin is in a region with heavy snow.</li>\n        <li>The stranger is facing the door.</li>\n        <li>The peephole has a wide-angle lens.</li>\n      </ul>\n    </div>",
    "question": "How did she know with absolute certainty that the stranger was a murderer?",
    "answers": [
      "footprints",
      "no footprints",
      "tracks",
      "no tracks in the snow",
      "no footprints in the snow"
    ],
    "hint": "Look closely at the ground around the stranger through the wide-angle peephole.",
    "explain": "It had been snowing heavily. Through the wide-angle peephole, she could see the ground around the stranger, but there were no footprints leading up to the door. The person had been waiting there since before the snow started falling, lying in wait."
  },
  {
    "id": 4,
    "diff": "Hard",
    "diffClass": "murder",
    "body": "<div class=\"scene-block\">\n      <div class=\"scene-label\">The Silent Witness</div>\n      <p class=\"scene-text\">A wealthy man is murdered in his study on a Sunday afternoon. The police question the staff. The butler says he was polishing silver. The maid says she was getting the mail. The chef says he was preparing dinner. The gardener says he was planting seeds.</p>\n      <ul class=\"clues-list\">\n        <li>It was a Sunday.</li>\n        <li>Mail delivery schedules.</li>\n        <li>Alibis must be airtight.</li>\n      </ul>\n    </div>",
    "question": "Who is the murderer and why?",
    "answers": [
      "maid",
      "the maid",
      "maid getting mail",
      "no mail on sunday"
    ],
    "hint": "Pay attention to the day of the week and the alibis provided.",
    "explain": "The maid is the murderer. She claimed to be getting the mail, but there is no mail delivery on Sundays."
  },
  {
    "id": 5,
    "diff": "Extreme",
    "diffClass": "murder",
    "body": "<div class=\"scene-block\">\n      <div class=\"scene-label\">The Bloodless Corpse</div>\n      <p class=\"scene-text\">A man is found dead in a snowy field. There are no footprints around him, no weapon, and no signs of a struggle. He has a single, small puncture wound on his back, but there is absolutely no blood on his clothes or the snow.</p>\n      <ul class=\"clues-list\">\n        <li>The puncture wound is deep.</li>\n        <li>The surrounding temperature is well below freezing.</li>\n        <li>The weapon melted.</li>\n      </ul>\n    </div>",
    "question": "What was the murder weapon?",
    "answers": [
      "icicle",
      "an icicle",
      "ice shard",
      "ice dagger",
      "ice"
    ],
    "hint": "The weapon left no trace because of the environment.",
    "explain": "The man was stabbed with an icicle. The cold temperature prevented immediate heavy bleeding externally, and the weapon melted away, leaving no trace."
  },
  {
    "id": 6,
    "diff": "Mind-Bending",
    "diffClass": "labyrinth",
    "body": "<div class=\"scene-block\">\n      <div class=\"scene-label\">The Final Message</div>\n      <p class=\"scene-text\">A man is murdered in his office. Before he dies, he writes a series of numbers on the calendar in his own blood: 6, 4, 9, 10, 11. The suspects are Jason, Shirley, Mark, John, and November.</p>\n      <ul class=\"clues-list\">\n        <li>The numbers correspond to months.</li>\n        <li>Look at the first letters.</li>\n        <li>The calendar is the key.</li>\n      </ul>\n    </div>",
    "question": "Who is the killer?",
    "answers": [
      "jason",
      "jason is the killer"
    ],
    "hint": "What are the 6th, 4th, 9th, 10th, and 11th months of the year?",
    "explain": "The 6th, 4th, 9th, 10th, and 11th months are June, April, September, October, and November. The first letters spell J-A-S-O-N."
  },
  {
    "id": 7,
    "diff": "Extreme",
    "diffClass": "extreme",
    "body": "<div class=\"scene-block\">\n      <div class=\"scene-label\">The Blind Man's Bluff</div>\n      <p class=\"scene-text\">A blind man is stranded on a desert island with two pills: one red, one blue. He must take exactly one of each to survive a deadly disease. If he takes two of the same color, he dies. He drops both pills on the sand, and they mix with two identical pills he dropped earlier (one red, one blue). Now he has four identical-feeling pills in front of him: two red, two blue.</p>\n      <ul class=\"clues-list\">\n        <li>He cannot see the colors.</li>\n        <li>He must consume exactly one red and one blue equivalent.</li>\n        <li>The pills can be broken.</li>\n      </ul>\n    </div>",
    "question": "How does he ensure he takes exactly one red and one blue pill?",
    "answers": [
      "cut them in half",
      "break them in half",
      "halve them",
      "split them",
      "take half of each"
    ],
    "hint": "He doesn't need to know which is which, he just needs an equal amount of each.",
    "explain": "He breaks each of the four pills exactly in half and takes one half from each pill. This guarantees he consumes the equivalent of one full red pill and one full blue pill."
  },
  {
    "id": 8,
    "diff": "Hard",
    "diffClass": "murder",
    "body": "<div class=\"scene-block\">\n      <div class=\"scene-label\">The Lighthouse Keeper</div>\n      <p class=\"scene-text\">A man turns off the light and goes to sleep. The next morning, he wakes up, looks out the window, and screams in horror. He realizes he has caused the deaths of hundreds of people.</p>\n      <ul class=\"clues-list\">\n        <li>The light was crucial for others.</li>\n        <li>He lives near the ocean.</li>\n        <li>The deaths happened at night.</li>\n      </ul>\n    </div>",
    "question": "Why did turning off the light cause such a tragedy?",
    "answers": [
      "he lived in a lighthouse",
      "it was a lighthouse",
      "ships crashed",
      "boat crash",
      "lighthouse keeper"
    ],
    "hint": "Where does he live and what is the light used for?",
    "explain": "He is a lighthouse keeper. By turning off the light, he removed the warning signal for ships, causing a massive shipwreck on the rocks during the night."
  },
  {
    "id": 9,
    "diff": "Extreme",
    "diffClass": "labyrinth",
    "body": "<div class=\"scene-block\">\n      <div class=\"scene-label\">The Cabin in the Woods</div>\n      <p class=\"scene-text\">You are fleeing a killer and lock yourself inside an abandoned cabin. The cabin has no windows, only one solid iron door. The killer cannot break in. You have no phone, no weapons, and no way to signal for help. After three days, the police find you dead inside, but the door is still locked from the inside, and the killer never entered.</p>\n      <ul class=\"clues-list\">\n        <li>The killer did not touch you.</li>\n        <li>You were trapped for three days.</li>\n        <li>Human biology is the cause of death.</li>\n      </ul>\n    </div>",
    "question": "How did you die?",
    "answers": [
      "starvation",
      "dehydration",
      "thirst",
      "lack of water",
      "died of thirst"
    ],
    "hint": "What do you need to survive for three days?",
    "explain": "You died of dehydration. While the cabin protected you from the killer, it had no water supply, and a human can only survive about three days without water."
  },
  {
    "id": 10,
    "diff": "Mind-Bending",
    "diffClass": "extreme",
    "body": "<div class=\"scene-block\">\n      <div class=\"scene-label\">The Two Doors</div>\n      <p class=\"scene-text\">You are trapped in a dungeon with two doors. One leads to freedom, the other to a gruesome death. Two guards stand before the doors. One always tells the truth, the other always lies. You don't know which is which, or which door leads where. You can ask only one question to one guard.</p>\n      <ul class=\"clues-list\">\n        <li>You must ask a question that involves both guards.</li>\n        <li>The answer must be a lie regardless of who you ask.</li>\n        <li>Use their traits against them.</li>\n      </ul>\n    </div>",
    "question": "What question do you ask to find the door to freedom?",
    "answers": [
      "what would the other guard say",
      "which door would the other guard point to",
      "ask the other guard"
    ],
    "hint": "You need a question whose answer will be a lie, regardless of who you ask.",
    "explain": "You ask either guard: 'If I asked the other guard which door leads to freedom, what would they say?' Both guards will point to the door of death. You then choose the opposite door."
  },
  {
    "id": 11,
    "diff": "Extreme",
    "diffClass": "murder",
    "body": "<div class=\"scene-block\">\n      <div class=\"scene-label\">The Mirror's Reflection</div>\n      <p class=\"scene-text\">A woman buys an antique mirror. Every night at exactly 3:33 AM, she wakes up to see a dark figure standing behind her in the mirror's reflection. When she turns around, the room is empty. She covers the mirror, but the next night, the cover is on the floor, and the figure is closer.</p>\n      <ul class=\"clues-list\">\n        <li>The figure is not a ghost.</li>\n        <li>The cover was physically moved.</li>\n        <li>The mirror is not what it seems.</li>\n      </ul>\n    </div>",
    "question": "Why is the figure only visible in the mirror, and how is it moving the cover?",
    "answers": [
      "it is a window",
      "two way mirror",
      "two-way mirror",
      "it is a window not a mirror",
      "someone is behind it"
    ],
    "hint": "Think about what else looks like a mirror in a dark room.",
    "explain": "It's not a mirror; it's a two-way glass window looking into a hidden room. The figure is a real person standing on the other side, and they are coming out at night to remove the cover."
  },
  {
    "id": 12,
    "diff": "Hard",
    "diffClass": "extreme",
    "body": "<div class=\"scene-block\">\n      <div class=\"scene-label\">The Buried Alive</div>\n      <p class=\"scene-text\">A man wakes up in pitch blackness. He feels wood inches above his face and realizes he's been buried alive in a coffin. He has a lighter in his pocket. He flicked it on to assess his situation.</p>\n      <ul class=\"clues-list\">\n        <li>The coffin is airtight.</li>\n        <li>He needs to breathe.</li>\n        <li>Fire requires fuel.</li>\n      </ul>\n    </div>",
    "question": "Why was turning on the lighter the worst mistake he could make?",
    "answers": [
      "uses up oxygen",
      "burns oxygen",
      "consumes oxygen",
      "oxygen depletion",
      "suffocation"
    ],
    "hint": "Fire needs something to burn to stay lit.",
    "explain": "A lighter consumes oxygen to maintain its flame. In a sealed, airtight coffin with a limited air supply, burning the lighter rapidly depletes the remaining oxygen, suffocating him much faster."
  }
];

export const TASKS: Task[] = [
  { icon: "📸", name: "Send Viral a selfie right now", desc: "Take it immediately. No retakes. No filters. Send it.", reward: "+1 heart", lives: 1 },
  { icon: "👑", name: "Tell Viral he is tall and great", desc: "Message him those exact words. Screenshot sent to Viral as proof.", reward: "+1 heart", lives: 1 },
  { icon: "🎙", name: "Iran war dare", desc: "Walk up to a stranger and casually start a conversation about the Iran war. Record it.", reward: "+2 hearts", lives: 2 },
  { icon: "👁", name: "Sustained eye contact dare", desc: "Make unbroken eye contact with the nearest person for 10 full seconds. Record the reaction.", reward: "+1 heart", lives: 1 },
  { icon: "📣", name: "Fake announcement dare", desc: "Stand up, clear your throat loudly, say I have something important to say then sit down and say nothing.", reward: "+1 heart", lives: 1 },
  { icon: "🫣", name: "Camera roll screenshot", desc: "Send Viral a screenshot of your 9 most recent photos. No deleting anything first.", reward: "+1 heart", lives: 1 },
  { icon: "🥤", name: "Chug a glass of water", desc: "Record yourself drinking a full glass of water in one go. No stopping.", reward: "+1 heart", lives: 1 },
  { icon: "🤸", name: "Do 10 pushups", desc: "Record yourself doing 10 clean pushups. Viral is watching your form.", reward: "+1 heart", lives: 1 },
  { icon: "🎤", name: "Sing Happy Birthday", desc: "Call a random contact (or a friend) and sing Happy Birthday loudly. Record the call.", reward: "+2 hearts", lives: 2 },
  { icon: "❤️", name: "Tell a friend you love them", desc: "Call a close friend and tell them you love them out of nowhere. Record the reaction.", reward: "+1 heart", lives: 1 },
  { icon: "🤸‍♂️", name: "Handstand challenge", desc: "Do a handstand against a wall for 5 seconds. Record it.", reward: "+1 heart", lives: 1 },
  { icon: "🔥", name: "Hot sauce challenge", desc: "Eat a spoonful of hot sauce or a spicy chili. Record the reaction.", reward: "+2 hearts", lives: 2 }
];

export const HINT_TASKS: Task[] = [
  { icon: "🤳", name: "Send Viral a dramatic I give up video", desc: "Full commitment. Oscar-worthy. Send it. He will give you a nudge.", reward: "Unlock hint" },
  { icon: "🦆", name: "Do your best duck impression", desc: "Record yourself for at least 5 seconds. Viral decides if it is good enough.", reward: "Unlock hint" },
  { icon: "📝", name: "Write Viral a formal complaint letter", desc: "Dear Viral, Re: Unfair Difficulty... If it is funny enough, you get a hint.", reward: "Unlock hint" },
  { icon: "🤡", name: "Joker Laugh", desc: "Record your best Joker laugh and send it to Viral. Must be creepy.", reward: "Unlock hint" },
  { icon: "💃", name: "Public Dance", desc: "Do a 10-second dance in a public place (mall, park, street). Record it.", reward: "Unlock hint" },
  { icon: "📱", name: "WhatsApp Status Dare", desc: "Post 'I am a potato' as your WhatsApp status for 1 hour. Send screenshot proof.", reward: "Unlock hint" },
  { icon: "🍋", name: "Eat a lemon slice", desc: "Record yourself eating a lemon slice without making a face. Good luck.", reward: "Unlock hint" },
  { icon: "😂", name: "Tell a joke to a stranger", desc: "Walk up to a stranger and tell them a joke. They must laugh (or at least smile). Record it.", reward: "Unlock hint" },
  { icon: "🥄", name: "Spoon balance", desc: "Balance a spoon on your nose for 10 seconds. Record it.", reward: "Unlock hint" }
];
