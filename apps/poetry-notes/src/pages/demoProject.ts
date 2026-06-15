import type { Project } from '../types';

// The user's actual "The Chimney Sweeper" annotation export, embedded verbatim.
// String.raw preserves every JSON escape (\" \n) exactly as provided so the
// values are parsed unchanged — positions, widths, content and highlights are
// the user's, untouched.
const RAW = String.raw`{
  "projectId": "c0babfa3-d897-4665-b647-0bfe63f965de",
  "version": "1.0",
  "title": "The Chimney Sweeper",
  "createdAt": "2026-03-02T02:40:24.909Z",
  "lastModified": "2026-06-04T10:45:39.776Z",
  "poem": {
    "content": "<p><span class=\"poet-highlight\" data-highlight-id=\"highlight-1772420185173-i88wwygrg\" data-highlight-color=\"#4cc9f0\" style=\"background-color: rgba(76, 201, 240, 0.133); border-bottom-color: rgba(76, 201, 240, 0.4);\">The Chimney Sweeper</span> by William Blake</p><p></p><p>A little black <span class=\"poet-highlight\" data-highlight-id=\"highlight-1772420420327-2l5fkgp9g\" data-highlight-color=\"#7209b7\" style=\"background-color: rgba(114, 9, 183, 0.133); border-bottom-color: rgba(114, 9, 183, 0.4);\">thing</span> among the snow,</p><p>Crying \"<span class=\"poet-highlight\" data-highlight-id=\"highlight-1772420446383-ztsje2fdl\" data-highlight-color=\"#4361ee\" style=\"background-color: rgba(67, 97, 238, 0.133); border-bottom-color: rgba(67, 97, 238, 0.4);\">weep! 'weep!</span>\" in notes of <span class=\"poet-highlight\" data-highlight-id=\"highlight-1772420496644-9cbf4xu0f\" data-highlight-color=\"#4caf50\" style=\"background-color: rgba(76, 175, 80, 0.133); border-bottom-color: rgba(76, 175, 80, 0.4);\">w</span>oe!</p><p><span class=\"poet-highlight\" data-highlight-id=\"highlight-1772420650009-ub0nnfaqg\" data-highlight-color=\"#f72585\" style=\"background-color: rgba(247, 37, 133, 0.133); border-bottom-color: rgba(247, 37, 133, 0.4);\">\"Where are thy father and mother? say?\"</span></p><p><span class=\"poet-highlight\" data-highlight-id=\"highlight-1772420719843-3jfi5zyh9\" data-highlight-color=\"#00f5d4\" style=\"background-color: rgba(0, 245, 212, 0.133); border-bottom-color: rgba(0, 245, 212, 0.4);\">\"They are both gone up to the church to pray.</span></p><p></p><p>Because I was <span class=\"poet-highlight\" data-highlight-id=\"highlight-1772421132445-u8zv7dra0\" data-highlight-color=\"#fee440\" style=\"background-color: rgba(254, 228, 64, 0.133); border-bottom-color: rgba(254, 228, 64, 0.4);\">happy</span> upon the <span class=\"poet-highlight\" data-highlight-id=\"highlight-1772421061328-velh5477x\" data-highlight-color=\"#fee440\" style=\"background-color: rgba(254, 228, 64, 0.133); border-bottom-color: rgba(254, 228, 64, 0.4);\">heath</span>,</p><p>And <span class=\"poet-highlight\" data-highlight-id=\"highlight-1772421166142-9omqfcv92\" data-highlight-color=\"#e94560\" style=\"background-color: rgba(233, 69, 96, 0.133); border-bottom-color: rgba(233, 69, 96, 0.4);\">smil'd</span> among the winter's snow,</p><p><span class=\"poet-highlight\" data-highlight-id=\"highlight-1772421213021-7eo9yhdh1\" data-highlight-color=\"#ffc107\" style=\"background-color: rgba(255, 193, 7, 0.133); border-bottom-color: rgba(255, 193, 7, 0.4);\">They</span> clothed me in the <span class=\"poet-highlight\" data-highlight-id=\"highlight-1772421307288-o5hojlliu\" data-highlight-color=\"#4cc9f0\" style=\"background-color: rgba(76, 201, 240, 0.133); border-bottom-color: rgba(76, 201, 240, 0.4);\">clothes of death</span>,</p><p>And taught me to sing the <span class=\"poet-highlight\" data-highlight-id=\"highlight-1772421487193-z0orvzfdn\" data-highlight-color=\"#7209b7\" style=\"background-color: rgba(114, 9, 183, 0.133); border-bottom-color: rgba(114, 9, 183, 0.4);\">notes of woe</span>.</p><p></p><p><span class=\"poet-highlight\" data-highlight-id=\"highlight-1772421558177-s649ntu6z\" data-highlight-color=\"#4361ee\" style=\"background-color: rgba(67, 97, 238, 0.133); border-bottom-color: rgba(67, 97, 238, 0.4);\">And because I am happy and dance and sing,</span></p><p><span class=\"poet-highlight\" data-highlight-id=\"highlight-1772421589826-q6w4a4bir\" data-highlight-color=\"#4caf50\" style=\"background-color: rgba(76, 175, 80, 0.133); border-bottom-color: rgba(76, 175, 80, 0.4);\">They think they have done me no injury,</span></p><p><span class=\"poet-highlight\" data-highlight-id=\"highlight-1772421635439-n3cckwljr\" data-highlight-color=\"#ff9f1c\" style=\"background-color: rgba(255, 159, 28, 0.133); border-bottom-color: rgba(255, 159, 28, 0.4);\">And are gone to praise God and his Priest and King,</span></p><p>Who <span class=\"poet-highlight\" data-highlight-id=\"highlight-1772421700015-pkqd1m3o8\" data-highlight-color=\"#f72585\" style=\"background-color: rgba(247, 37, 133, 0.133); border-bottom-color: rgba(247, 37, 133, 0.4);\">make up</span> a heaven of our misery.\"</p>",
    "highlights": [
      {
        "id": "highlight-1772420185173-i88wwygrg",
        "lineIndex": 0,
        "startOffset": 0,
        "endOffset": 19,
        "text": "The Chimney Sweeper",
        "noteIds": [
          "975ae216-6d13-4f3c-90a0-a5e5794e38e8"
        ]
      },
      {
        "id": "highlight-1772420420327-2l5fkgp9g",
        "lineIndex": 2,
        "startOffset": 51,
        "endOffset": 56,
        "text": "thing",
        "noteIds": [
          "c4aba9e8-6c7c-4bcc-a84b-e25b5b05fb2b"
        ]
      },
      {
        "id": "highlight-1772420446383-ztsje2fdl",
        "lineIndex": 3,
        "startOffset": 80,
        "endOffset": 92,
        "text": "weep! 'weep!",
        "noteIds": [
          "0c6320a7-2f66-4af8-911a-0873d67f3000"
        ]
      },
      {
        "id": "highlight-1772420496644-9cbf4xu0f",
        "lineIndex": 3,
        "startOffset": 106,
        "endOffset": 107,
        "text": "w",
        "noteIds": [
          "9964c6b2-cd99-4e9e-8372-31876ec17194"
        ]
      },
      {
        "id": "highlight-1772420650009-ub0nnfaqg",
        "lineIndex": 4,
        "startOffset": 110,
        "endOffset": 149,
        "text": "\"Where are thy father and mother? say?\"",
        "noteIds": [
          "514e1ebd-2768-45ef-ac2a-a642f0afebc6"
        ]
      },
      {
        "id": "highlight-1772420719843-3jfi5zyh9",
        "lineIndex": 5,
        "startOffset": 149,
        "endOffset": 194,
        "text": "\"They are both gone up to the church to pray.",
        "noteIds": [
          "e37f4d23-b85f-4652-81cf-bb3b237fb593"
        ]
      },
      {
        "id": "highlight-1772421061328-velh5477x",
        "lineIndex": 7,
        "startOffset": 223,
        "endOffset": 228,
        "text": "heath",
        "noteIds": [
          "6919fbb5-b7d4-4deb-9038-092b0665ff93"
        ]
      },
      {
        "id": "highlight-1772421132445-u8zv7dra0",
        "lineIndex": 7,
        "startOffset": 208,
        "endOffset": 213,
        "text": "happy",
        "noteIds": [
          "6919fbb5-b7d4-4deb-9038-092b0665ff93"
        ]
      },
      {
        "id": "highlight-1772421166142-9omqfcv92",
        "lineIndex": 8,
        "startOffset": 233,
        "endOffset": 239,
        "text": "smil'd",
        "noteIds": [
          "0dc468cd-d66b-423a-a449-52be7c8aceba"
        ]
      },
      {
        "id": "highlight-1772421213021-7eo9yhdh1",
        "lineIndex": 9,
        "startOffset": 264,
        "endOffset": 268,
        "text": "They",
        "noteIds": [
          "c5d730fe-0add-4f48-bc0d-86bb139a2e2c"
        ]
      },
      {
        "id": "highlight-1772421307288-o5hojlliu",
        "lineIndex": 9,
        "startOffset": 287,
        "endOffset": 303,
        "text": "clothes of death",
        "noteIds": [
          "9632ba2c-0151-418f-8f36-7bb8f5d51e1f"
        ]
      },
      {
        "id": "highlight-1772421487193-z0orvzfdn",
        "lineIndex": 10,
        "startOffset": 330,
        "endOffset": 342,
        "text": "notes of woe",
        "noteIds": [
          "5b900915-6de6-4e46-bb32-8950753ac59e"
        ]
      },
      {
        "id": "highlight-1772421558177-s649ntu6z",
        "lineIndex": 12,
        "startOffset": 343,
        "endOffset": 385,
        "text": "And because I am happy and dance and sing,",
        "noteIds": [
          "563339c0-4369-485b-b348-7a5aa22729f7"
        ]
      },
      {
        "id": "highlight-1772421589826-q6w4a4bir",
        "lineIndex": 13,
        "startOffset": 385,
        "endOffset": 424,
        "text": "They think they have done me no injury,",
        "noteIds": [
          "45fbd7d0-5d79-4317-883f-7d64540020d8"
        ]
      },
      {
        "id": "highlight-1772421635439-n3cckwljr",
        "lineIndex": 14,
        "startOffset": 424,
        "endOffset": 475,
        "text": "And are gone to praise God and his Priest and King,",
        "noteIds": [
          "3c39e40c-0d0e-46c2-a97b-2ef7c37dc8ae"
        ]
      },
      {
        "id": "highlight-1772421700015-pkqd1m3o8",
        "lineIndex": 15,
        "startOffset": 479,
        "endOffset": 486,
        "text": "make up",
        "noteIds": [
          "6c37d664-01d7-4951-bd79-c31b3b4f9f6c"
        ]
      }
    ]
  },
  "notes": [
    {
      "id": "note-context",
      "content": "The 18th century poem \"The Chimney Sweeper\" is written by William Blake and was published in the collection \"Songs of Experience\". A counter poem with the same name was published in the \"Songs of Innocence\" five years prior. While the former explores darker, cynical views of the world, and themes regarding suffering and the loss of innocence, the latter explores an idealized and optimistic view of purity, joy, and the innocence of childhood. At the time of writing, Blake observed how poverty often drove families to sell children into chimney sweeping.",
      "position": {
        "x": -200.30555555555566,
        "y": 936.3888888888888
      },
      "textReferences": [],
      "linkedNotes": [],
      "createdAt": "2026-03-02T02:40:24.909Z",
      "lastModified": "2026-03-02T03:25:20.846Z",
      "type": "context",
      "isCollapsed": false,
      "width": 832.5
    },
    {
      "id": "note-personal-response",
      "content": "The concept of a Church is highly hypocritical in \"The Chimney Sweeper\" as it justifies child labour. In this poem and the counter poem in Songs of Innocence, it can be observed that the Church affirms poverty and hardship as a part of God's plan, and that suffering faithfully would lead to rewards in heaven. This highlights the Church's abuse of religion to justify oppression. The children were often told that hard work represented moral goodness, and that being idle was a sin. Lastly, the lie that sold the idea to parents was that the occupation of children was saving their soul, which led to parents selling their children away, and the death of thousands of children during chimney sweeping in Europe.",
      "position": {
        "x": 684.3610704210068,
        "y": 930.8611111111111
      },
      "textReferences": [],
      "linkedNotes": [],
      "createdAt": "2026-03-02T02:40:24.909Z",
      "lastModified": "2026-03-02T03:28:12.935Z",
      "type": "personal-response",
      "isCollapsed": false,
      "width": 985
    },
    {
      "id": "975ae216-6d13-4f3c-90a0-a5e5794e38e8",
      "content": "Structure: The poem is divided into three quatrains with an irregular rhyme scheme. The first stanza follows rhyming couplets while the other two follow alternate rhyme. The whole poem utilizes masculine rhyme, excluding lines 10 and 12 which utilize feminine rhyme. The meter is also irregular, mixing iambs and anapests. Each line contains 8-11 syllables and uses plain, simple diction.\n\nThe title is repeated in another collection, Songs of Innocence. The poem in the Songs of Innocence explore chimney sweeping in a more optimistic, naive light while the poem in Songs of Experience explore chimney sweeping in a darker, bleaker light. Having the same title emphasizes the stark contrast between the two collections.",
      "position": {
        "x": -282.08333333333337,
        "y": 2.5277777777777857
      },
      "textReferences": [
        "highlight-1772420185173-i88wwygrg"
      ],
      "linkedNotes": [],
      "createdAt": "2026-03-02T02:56:25.176Z",
      "lastModified": "2026-03-02T03:16:49.075Z",
      "width": 811.4166666666666
    },
    {
      "id": "c4aba9e8-6c7c-4bcc-a84b-e25b5b05fb2b",
      "content": "The child is dehumanized to a mere creature of no value.",
      "position": {
        "x": 333,
        "y": 251.53125
      },
      "textReferences": [
        "highlight-1772420420327-2l5fkgp9g"
      ],
      "linkedNotes": [],
      "createdAt": "2026-03-02T03:00:20.330Z",
      "lastModified": "2026-03-02T03:17:05.841Z",
      "width": 196.25
    },
    {
      "id": "0c6320a7-2f66-4af8-911a-0873d67f3000",
      "content": "Epizeuxis: The repeated \"weep\" emphasizes the child's distress.",
      "position": {
        "x": 1270,
        "y": 29.921875
      },
      "textReferences": [
        "highlight-1772420446383-ztsje2fdl"
      ],
      "linkedNotes": [
        "9964c6b2-cd99-4e9e-8372-31876ec17194",
        "0b225f40-9ece-4284-b642-4e4209d370fb"
      ],
      "createdAt": "2026-03-02T03:00:46.385Z",
      "lastModified": "2026-03-02T03:01:28.093Z",
      "width": 247
    },
    {
      "id": "9964c6b2-cd99-4e9e-8372-31876ec17194",
      "content": "Alliteration: The repeated /w/ sound mimics the weak voice of a young child.",
      "position": {
        "x": 1579,
        "y": 36.171875
      },
      "textReferences": [
        "highlight-1772420496644-9cbf4xu0f"
      ],
      "linkedNotes": [],
      "createdAt": "2026-03-02T03:01:36.647Z",
      "lastModified": "2026-03-02T03:02:28.838Z",
      "width": 294
    },
    {
      "id": "0b225f40-9ece-4284-b642-4e4209d370fb",
      "content": "The apostrophe could represent a missing letter, meaning the child could be saying \"sweep\" as an ad for their services. The child's inability to pronounce \"sweep\" clearly reflects the underdeveloped language skills of the child.",
      "position": {
        "x": 1342.25,
        "y": 191.671875
      },
      "textReferences": [],
      "linkedNotes": [],
      "createdAt": "2026-03-02T03:02:41.772Z",
      "lastModified": "2026-03-02T03:17:39.175Z",
      "width": 791.8888888888889
    },
    {
      "id": "514e1ebd-2768-45ef-ac2a-a642f0afebc6",
      "content": "The question silently accuses the parents while acknowledging the underlying religious systems that allow this suffering to persist",
      "position": {
        "x": 1626.3333333333333,
        "y": 313.8125
      },
      "textReferences": [
        "highlight-1772420650009-ub0nnfaqg"
      ],
      "linkedNotes": [],
      "createdAt": "2026-03-02T03:04:10.012Z",
      "lastModified": "2026-03-02T03:04:56.666Z",
      "width": 505
    },
    {
      "id": "e37f4d23-b85f-4652-81cf-bb3b237fb593",
      "content": "The child's response highlights his devastating naivety and a silent acceptance of his fate. The child has internalised suffering as normal. It also marks a pivotal moment in the poem as the child's voice takes over the narrative. There is a juxtaposition of the parent's spiritual pursuits against the neglect of their child, highlighting their hypocrisy. The parents believe that they are fulfilling their duties by seeking divine approval for their choices.",
      "position": {
        "x": 1299.6666666666665,
        "y": 440.81423611111114
      },
      "textReferences": [
        "highlight-1772420719843-3jfi5zyh9"
      ],
      "linkedNotes": [],
      "createdAt": "2026-03-02T03:05:19.846Z",
      "lastModified": "2026-03-02T03:17:52.243Z",
      "width": 825.1944444444445
    },
    {
      "id": "6919fbb5-b7d4-4deb-9038-092b0665ff93",
      "content": "\"heath\" represents an open countryside. This juxtaposes the setting of the child's childhood in the \"heath\" against the claustrophobic, filthy conditions in which he now resides.\n\nAlliteration: The alliteration of the /h/ sound reflects the child's happiness upon the heath.",
      "position": {
        "x": -277.1111111111111,
        "y": 257.4220241970486
      },
      "textReferences": [
        "highlight-1772421061328-velh5477x",
        "highlight-1772421132445-u8zv7dra0"
      ],
      "linkedNotes": [],
      "createdAt": "2026-03-02T03:11:01.332Z",
      "lastModified": "2026-06-04T10:21:48.908Z",
      "width": 599.1666666666666
    },
    {
      "id": "0dc468cd-d66b-423a-a449-52be7c8aceba",
      "content": "Juxtaposition: The juxtaposition of the child's previous smiles and current weeps highlights his loss of innocence.",
      "position": {
        "x": -253.97222222222229,
        "y": 538.4958089192709
      },
      "textReferences": [
        "highlight-1772421166142-9omqfcv92"
      ],
      "linkedNotes": [],
      "createdAt": "2026-03-02T03:12:46.145Z",
      "lastModified": "2026-03-02T03:13:25.284Z",
      "width": 422.22222222222223
    },
    {
      "id": "c5d730fe-0add-4f48-bc0d-86bb139a2e2c",
      "content": "The ambiguity created by the pronoun implicates both the parents and the Church, creating a web of blame as the parents are directly responsible for the child's suffering, however the Church is responsible for the ideological justification.",
      "position": {
        "x": -307.6111111111111,
        "y": 410.2222222222222
      },
      "textReferences": [
        "highlight-1772421213021-7eo9yhdh1"
      ],
      "linkedNotes": [],
      "createdAt": "2026-03-02T03:13:33.023Z",
      "lastModified": "2026-03-02T03:17:21.842Z",
      "width": 837.0833333333333
    },
    {
      "id": "9632ba2c-0151-418f-8f36-7bb8f5d51e1f",
      "content": "Literally, \"clothes of death\" could represent soot-covered rags. Metaphorically, it could represent the inevitability of death caused by the physical toll of chimney sweeping on often malnourished boys.",
      "position": {
        "x": 1399.3055555555557,
        "y": 608.3333333333333
      },
      "textReferences": [
        "highlight-1772421307288-o5hojlliu"
      ],
      "linkedNotes": [],
      "createdAt": "2026-03-02T03:15:07.292Z",
      "lastModified": "2026-03-02T03:16:26.600Z",
      "width": 721.1111111111111
    },
    {
      "id": "5b900915-6de6-4e46-bb32-8950753ac59e",
      "content": "Refrain: Highlights the enduring and cyclical nature of suffering.",
      "position": {
        "x": 1278.75,
        "y": 735.3250122070312
      },
      "textReferences": [
        "highlight-1772421487193-z0orvzfdn"
      ],
      "linkedNotes": [],
      "createdAt": "2026-03-02T03:18:07.197Z",
      "lastModified": "2026-03-02T03:19:01.525Z",
      "width": 256.25
    },
    {
      "id": "563339c0-4369-485b-b348-7a5aa22729f7",
      "content": "The child maintains an enduring hope of salvation caused by religious promises.",
      "position": {
        "x": -215,
        "y": 678.7000122070312
      },
      "textReferences": [
        "highlight-1772421558177-s649ntu6z"
      ],
      "linkedNotes": [],
      "createdAt": "2026-03-02T03:19:18.180Z",
      "lastModified": "2026-03-02T03:19:48.521Z",
      "width": 328.75
    },
    {
      "id": "45fbd7d0-5d79-4317-883f-7d64540020d8",
      "content": "As the child does not show signs of distress, parents are in a state of blissful ignorance.",
      "position": {
        "x": 196.5,
        "y": 537.2625122070312
      },
      "textReferences": [
        "highlight-1772421589826-q6w4a4bir"
      ],
      "linkedNotes": [],
      "createdAt": "2026-03-02T03:19:49.830Z",
      "lastModified": "2026-03-02T03:20:19.248Z",
      "width": 326.25
    },
    {
      "id": "3c39e40c-0d0e-46c2-a97b-2ef7c37dc8ae",
      "content": "Polysyndeton: The use of polysyndeton connects religion and the government in exploitation as one's relationship with God is mediated by worldly concerns.",
      "position": {
        "x": -210,
        "y": 808.3250122070312
      },
      "textReferences": [
        "highlight-1772421635439-n3cckwljr"
      ],
      "linkedNotes": [],
      "createdAt": "2026-03-02T03:20:35.442Z",
      "lastModified": "2026-03-02T03:21:29.267Z",
      "width": 567.5
    },
    {
      "id": "6c37d664-01d7-4951-bd79-c31b3b4f9f6c",
      "content": "The use of the phrase \"make up\" suggests a fabrication, perhaps of the promise of heaven. Therefore religion is used to pacify the oppressed.",
      "position": {
        "x": 1583.499984741211,
        "y": 740.6375122070312
      },
      "textReferences": [
        "highlight-1772421700015-pkqd1m3o8"
      ],
      "linkedNotes": [],
      "createdAt": "2026-03-02T03:21:40.019Z",
      "lastModified": "2026-03-02T03:22:30.847Z",
      "width": 503.75
    }
  ],
  "connections": [
    {
      "id": "conn-1772420531260",
      "fromNoteId": "0c6320a7-2f66-4af8-911a-0873d67f3000",
      "toNoteId": "9964c6b2-cd99-4e9e-8372-31876ec17194",
      "type": "note-to-note"
    },
    {
      "id": "conn-1772420561773",
      "fromNoteId": "0c6320a7-2f66-4af8-911a-0873d67f3000",
      "toNoteId": "0b225f40-9ece-4284-b642-4e4209d370fb",
      "type": "note-to-note"
    }
  ]
}`;

const demoProject = JSON.parse(RAW) as Project;

export default demoProject;
