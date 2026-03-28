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
    id: 1,
    diff: "Insane",
    diffClass: "murder",
    body: `<div class="scene-block">
      <div class="scene-label">The Silent Witness</div>
      <p class="scene-text">A man is found dead in his study. He was stabbed in the back while sitting at his desk. On the desk is a calendar with the numbers 6, 4, 9, 10, 11 written in blood. The suspects are his wife (Mary), his business partner (John), his lawyer (Paul), and his chef (Jason).</p>
    </div>`,
    question: "Who killed him?",
    answers: ["jason"],
    hint: "The numbers correspond to the months of the year.",
    explain: "6=June, 4=April, 9=September, 10=October, 11=November. The first letters spell JASON."
  },
  {
    id: 2,
    diff: "Insane",
    diffClass: "murder",
    body: `<div class="scene-block">
      <div class="scene-label">The Frozen Room</div>
      <p class="scene-text">A man is found dead in a room with no windows and a door locked from the inside. He is hanging from the ceiling. The only thing in the room is a large puddle of water beneath him. There are no chairs, tables, or ladders.</p>
    </div>`,
    question: "How did he die?",
    answers: ["ice", "block of ice", "he stood on ice"],
    hint: "The puddle wasn't there when he entered the room.",
    explain: "He stood on a block of ice to hang himself, and it melted away."
  },
  {
    id: 3,
    diff: "Insane",
    diffClass: "murder",
    body: `<div class="scene-block">
      <div class="scene-label">The Midnight Call</div>
      <p class="scene-text">You receive a call at 3 AM. A voice says, 'I am in your house.' You check all the doors and windows; they are locked. You check the security cameras; no one is there. You go to your bedroom and look in the mirror. You see the man standing behind you, but when you turn around, the room is empty.</p>
    </div>`,
    question: "Where is he?",
    answers: ["inside the mirror", "the mirror", "behind the glass"],
    hint: "The mirror isn't showing a reflection of your room.",
    explain: "The 'man' is an entity trapped within or manifesting through the mirror itself."
  },
  {
    id: 4,
    diff: "Insane",
    diffClass: "murder",
    body: `<div class="scene-block">
      <div class="scene-label">The Last Meal</div>
      <p class="scene-text">A death row inmate is offered a final meal. He asks for a fruit that has its seeds on the outside. After eating it, he dies instantly, before his execution. The guards are confused because the fruit wasn't poisoned.</p>
    </div>`,
    question: "What did he eat?",
    answers: ["strawberry", "a strawberry"],
    hint: "It's a common red fruit.",
    explain: "He was severely allergic to strawberries."
  },
  {
    id: 5,
    diff: "Insane",
    diffClass: "murder",
    body: `<div class="scene-block">
      <div class="scene-label">The Shadow Play</div>
      <p class="scene-text">You are in a dark room with a single candle. You see your shadow on the wall. Suddenly, your shadow starts moving independently of you. it reaches out and grabs a knife from a nearby table. You feel a sharp pain in your chest.</p>
    </div>`,
    question: "What is the shadow?",
    answers: ["a demon", "an entity", "your soul", "death"],
    hint: "It's a part of you that has turned against you.",
    explain: "Your own shadow has become a separate, malevolent entity."
  },
  {
    id: 6,
    diff: "Insane",
    diffClass: "murder",
    body: `<div class="scene-block">
      <div class="scene-label">The Echo Chamber</div>
      <p class="scene-text">You shout into a deep well: 'Is anyone there?' An echo replies: 'Is anyone there?' You shout: 'Help me!' The echo replies: 'No one can help you now.'</p>
    </div>`,
    question: "What is in the well?",
    answers: ["not an echo", "a mimic", "something alive", "a monster"],
    hint: "An echo only repeats what it hears.",
    explain: "The response was not an echo, but something mimicking your voice and responding with its own words."
  },
  {
    id: 7,
    diff: "Insane",
    diffClass: "murder",
    body: `<div class="scene-block">
      <div class="scene-label">The Red Room</div>
      <p class="scene-text">A man is found dead in a room where everything is red: the walls, the floor, the ceiling, the furniture. He died of blood loss, but there is no blood anywhere in the room except for a small drop on his finger.</p>
    </div>`,
    question: "How did he die?",
    answers: ["he was a mosquito", "mosquito", "insect"],
    hint: "The perspective is not human.",
    explain: "The 'man' was actually a mosquito that had gorged itself on blood and was crushed."
  },
  {
    id: 8,
    diff: "Insane",
    diffClass: "murder",
    body: `<div class="scene-block">
      <div class="scene-label">The Locked Box</div>
      <p class="scene-text">You find a box that says: 'Do not open.' You open it anyway. Inside is a smaller box that says: 'I warned you.' You open that one, and inside is a mirror. You look into the mirror and see yourself, but your eyes are missing.</p>
    </div>`,
    question: "What was in the box?",
    answers: ["your sight", "your eyes", "a curse"],
    hint: "The box took something from you the moment you looked.",
    explain: "The box contained a curse that physically or spiritually removed your eyes."
  },
  {
    id: 9,
    diff: "Insane",
    diffClass: "murder",
    body: `<div class="scene-block">
      <div class="scene-label">The Whispering Woods</div>
      <p class="scene-text">You are lost in a forest. Every tree you pass has your name carved into it. You hear a voice whispering: 'You've been here before. You'll be here forever.' You find a clearing with a single grave. The headstone has your name and today's date on it.</p>
    </div>`,
    question: "Where are you?",
    answers: ["purgatory", "hell", "a loop", "dead"],
    hint: "The date is the key.",
    explain: "You are trapped in a time loop or a state of purgatory where you relive your death."
  },
  {
    id: 10,
    diff: "Insane",
    diffClass: "murder",
    body: `<div class="scene-block">
      <div class="scene-label">The Static Man</div>
      <p class="scene-text">You see a man made of television static standing in your hallway. He points at you, and your vision starts to flicker. You try to scream, but only static comes out of your mouth. You realize your hands are starting to turn into static too.</p>
    </div>`,
    question: "What is happening?",
    answers: ["you are being erased", "erasure", "digitization", "becoming static"],
    hint: "You are losing your physical form.",
    explain: "The entity is consuming your reality and turning you into static."
  },
  {
    id: 11,
    diff: "Insane",
    diffClass: "murder",
    body: `<div class="scene-block">
      <div class="scene-label">The Empty Cradle</div>
      <p class="scene-text">You hear a baby crying in the attic. You go up to check, but the attic is empty. You see an old cradle rocking back and forth. You stop the cradle, but the crying gets louder. You look inside the cradle and see a note that says: 'I'm still here, Mother.'</p>
    </div>`,
    question: "Who is crying?",
    answers: ["a ghost baby", "a spirit", "the deceased", "ghost"],
    hint: "The note implies a past tragedy.",
    explain: "The spirit of a deceased child is haunting the house."
  },
  {
    id: 12,
    diff: "Insane",
    diffClass: "murder",
    body: `<div class="scene-block">
      <div class="scene-label">The Final Breath</div>
      <p class="scene-text">You are in a room with no air. You have one minute to live. There are three doors. Behind the first is a vacuum that will suck you out into space. Behind the second is a room filled with poisonous gas. Behind the third is a room filled with water.</p>
    </div>`,
    question: "Which door do you choose?",
    answers: ["third", "the third", "water", "the water"],
    hint: "You can hold your breath in one of these.",
    explain: "You can survive for a short time in water by holding your breath, unlike the other two which are instant death."
  }
];

export interface Task {
  icon: string;
  name: string;
  desc: string;
  reward: string;
  lives?: number;
}

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
