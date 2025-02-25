import * as Tone from "https://cdn.skypack.dev/tone";

const noteslib = ['A#6', 'G#6', 'G6', 'F6', 'F6', 'D#6', 'D#6', 'C#6', 'C#6', 'C6', 'C6', 'A#5', 'A#5', 'G#5', 'G#5', 'G5', 'F5', 'D#5', 'C5', 'A#4', 'G#4', 'D#4', ];
const notes = noteslib.slice(0);
let started = false;
let playing = false;
let beat = 0;
const colsinputval = 360;
let songs = [];

const loadSongsFromMemory = () => {
  if (localStorage.getItem('fprecords') && Object.keys(JSON.parse(localStorage.getItem('fprecords'))).length > 0) {
    songs = JSON.parse(localStorage.getItem('fprecords'));
  } else {
    songs = [
      {
        title: "JACK AND JILL",
        notes: [
            [
                "110",
                "234",
                "290",
                "53"
            ],
            [
                "121",
                "133",
                "156",
                "301",
                "312",
                "335",
                "76"
            ],
            [
                "286",
                "106"
            ],
            [
                "144",
                "346"
            ],
            [
                "95",
                "275",
                "166",
                "323"
            ],
            [
                "125",
                "151",
                "174",
                "331",
                "353"
            ],
            [
                "319",
                "342",
                "98",
                "140",
                "279",
                "163"
            ],
            [
                "346",
                "143",
                "223",
                "242"
            ],
            [
                "41",
                "60",
                "323",
                "166",
                "230"
            ],
            [
                "64",
                "83",
                "128",
                "334",
                "155",
                "264",
                "301"
            ],
            [
                "121",
                "253",
                "357",
                "71",
                "132",
                "178",
                "312"
            ],
            [
                "109",
                "267",
                "4",
                "52",
                "222"
            ],
            [
                "41",
                "86",
                "185",
                "289"
            ],
            [
                "7",
                "83",
                "177",
                "256",
                "300"
            ],
            [
                "263",
                "120",
                "189",
                "356",
                "74"
            ],
            [
                "97",
                "278",
                "14",
                "196"
            ],
            [
                "344",
                "322",
                "267",
                "245",
                "230",
                "200",
                "167",
                "85",
                "18",
                "47",
                "63"
            ],
            [
                "74",
                "352",
                "329",
                "256",
                "277",
                "297",
                "97",
                "117",
                "143",
                "212",
                "151",
                "173",
                "196",
                "59"
            ],
            [
                "252",
                "188",
                "318",
                "340",
                "6",
                "71",
                "140",
                "162"
            ],
            [
                "86",
                "135",
                "337",
                "314",
                "266",
                "3",
                "17",
                "40",
                "158",
                "200",
                "222"
            ],
            [
                "131",
                "63",
                "356",
                "299",
                "310",
                "333",
                "244",
                "175",
                "153"
            ],
            [
                "108",
                "52",
                "30",
                "289",
                "232",
                "210"
            ]
        ],
        label: {
            logo: "fp",
            number: "1",
            text_top: "JACK AND JILL",
            text_bottom: ""
        }
      }
    ];
  }
}

const sequencer = document.getElementById("sequencer");
const beatwidth_range = document.getElementById('beatwidth');
const beatwidth_number = document.getElementById('beatwidth_number');
const beatwidth_reset = document.getElementById('beatwidth_reset');
const beatwidth_fill = document.getElementById('beatwidth_fill');
const beatwidth_default = 5.5;
const songmenu = document.getElementById("songmenu");
const songTitleInput = document.getElementById("songtitle");
const loadButton = document.getElementById("songloadbutton");
const saveSongButton = document.getElementById("savesongbutton");
const deleteButton = document.getElementById("deletesongbutton");
const disk_outside_wall = document.getElementById('wall1');
const disk_label_logo_input = document.getElementById('disk_label_logo_input');
const disk_label_number_input = document.getElementById('disk_label_number_input');
const disk_label_text_top_input = document.getElementById('disk_label_text_top_input');
const disk_label_text_bottom_input = document.getElementById('disk_label_text_bottom_input');
let leftButtonPressed = false;
const overlay_left = document.getElementById('overlay_left');
const overlay_top = document.getElementById('overlay_top');
const overlay_width = document.getElementById('overlay_width');
const overlay_height = document.getElementById('overlay_height');
const overlay_background = document.getElementById('overlay_background');
const overlay_opacity = document.getElementById('overlay_opacity');
const overlay_rotation = document.getElementById('overlay_rotation');
const overlay = document.getElementById('overlay');
const show_overlay = document.getElementById('show_overlay');
const disk2 = document.getElementById('disk2');

const newSong = () => {
  return {
    title: 'Chanson sans titre',
    notes: [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ],
    label: {
      logo: '(^_^)',
      number: '0',
      text_top: 'Chanson',
      text_bottom: 'sans titre'
    }
  };
};
let currentSong = { song: newSong() };

const clearPlayCursor = () => {
  document.querySelectorAll('.note').forEach(el => el.classList.remove('note-is-playing'));
}

const makeSongsMenuItems = (songs) => {
  songs.forEach((song, songIndex) => {
    const newSelectOption = document.createElement("option");
    newSelectOption.value = songIndex;
    newSelectOption.textContent = song.title;
    if (songIndex == currentSong.memoryId) newSelectOption.selected = true;
    songmenu.appendChild(newSelectOption);
  });
}

const makeSongsMenu = () => {
  songmenu.innerHTML = "";
  const blankMenuItem = document.createElement("option");
  blankMenuItem.textContent = "";
  blankMenuItem.selected = true;
  blankMenuItem.disabled = true;
  songmenu.appendChild(blankMenuItem);

  const newSongMenuItem = document.createElement("option");
  newSongMenuItem.textContent = "Nouvelle chanson";
  newSongMenuItem.value = "";
  songmenu.appendChild(newSongMenuItem);

  makeSongsMenuItems(songs);
}

const songToSaveExistInSongsInMemory = (songToSave, songsInMemory) => {
  let error = false;
  let lastIndex;
  songsInMemory.forEach((song, songIndex) => {
    if ((song.title == songTitleInput.value) || (songToSave.memoryId !== undefined)) {
      error = true;
      lastIndex = songIndex;
    }
  });
  return error ? lastIndex : false;
}

const saveSong = () => {
  let error = false;
  let overwrite = false;
  if (songTitleInput.value == '') {
    window.alert('Entrer un titre pour cette chanson');
  } else {
    let songIndex = songToSaveExistInSongsInMemory(currentSong.song, songs);
    currentSong.song.title = songTitleInput.value;
    if (songIndex !== false) {
      error = true;
      // if (window.confirm('Ce titre existe déjà. \nSouhaitez-vous remplacer la chanson.')) {
        overwrite = true;
        songs.splice(songIndex, 1, currentSong.song);
      // }
    } else {
      songs.push(currentSong.song);
      currentSong.memoryId = songs.length - 1;
    }
    if (overwrite || !error) {
      localStorage.setItem('fprecords', JSON.stringify(songs));
      loadSongsFromMemory();
      makeSongsMenu();
    }
  }
}

const deleteSongInMemory = (indexInMemory) => {
  songs.splice(indexInMemory, 1);
  localStorage.setItem('fprecords', JSON.stringify(songs));
  loadSongsFromMemory();
  currentSong = { song: newSong() };
  songTitleInput.value = '';
}

songTitleInput.value = currentSong.title || '';

saveSongButton.addEventListener('click', e => saveSong());
sequencer.addEventListener('click', e => saveSong());
sequencer.addEventListener('contextmenu', e => e.preventDefault());

deleteButton.addEventListener('click', e => {
  if (window.confirm('Supprimer la chanson ?')) {
    deleteSongInMemory(currentSong.memoryId);
    makeSongsMenu();
  }
});

const toggleNoteToDisk = (note, trackIndex, isActive) => {
  const block_id = `disk-note${trackIndex}-${note}`;
  if (isActive) {
    const gap = (trackIndex * 4) + ((trackIndex < 1) ? 0 : parseInt(trackIndex / 2) * 4);
    const left = 316 - gap;
    const origin = (226 - gap) * -1;
    const block_position = { left: left, origin: origin };
    const block = document.createElement('div');
    block.classList.add('disk_note');
    block.id = block_id;
    block.style.left = block_position.left + 'px';
    block.style.transformOrigin = block_position.origin + 'px';
    block.dataset.gap = block_position.gap;
    block.style.transform = `rotate(${((360 / colsinputval) * note) * -1}deg)`;
    disk_notes.appendChild(block);
  } else {
    document.getElementById(block_id).remove();
  }
}

const loadSongToDisk = (song) => {
  // Reset disk
  disk_notes.innerHTML = '';
  // Set label
  disk_label_logo.textContent = disk_label_logo_input.value = song.label.logo || '';
  disk_label_number.textContent = disk_label_number_input.value = song.label.number || '';
  disk_label_text_top.textContent = disk_label_text_top_input.value = song.label.text_top || '';
  disk_label_text_bottom.textContent = disk_label_text_bottom_input.value = song.label.text_bottom || '';
  // Add each note by track
  song.notes.forEach((track, trackIndex) => {
    track.forEach(note => toggleNoteToDisk(note, trackIndex, true));
  });
}

const loadSongToSequencer = (song) => {
  Array.from(document.querySelectorAll('#sequencer .note')).forEach(note => note.classList.remove('note-is-active'));
  song.notes.forEach((track, trackIndex) => {
    track.forEach(note => toggleNoteInSequencer(trackIndex, note, true));
  });
}

const addToPartition = (track, note) => {
  grid[track][note].isActive = true;
}

const loadSongToPartition = (song) => {
  // Reset grid
  grid = makePartition();
  // Add to grid
  song.notes.forEach((track, trackIndex) => {
    track.forEach(note => addToPartition(trackIndex, note));
  });
}

const selectSongOrBlank = () => {
  if (songmenu.value !== "") {
    return { song: songs[songmenu.value], memoryId: songmenu.value };
  } else {
    return { song: newSong() };
  }
}

const changeSong = () => {
  if (document.querySelectorAll('.note-is-active').length == 0
    || (
      document.querySelectorAll('.note-is-active').length > 0 
      && window.confirm("Le sequencer n'est pas vide. \nSi le contenu actuel n'est pas sauvegardé, toute modification sera perdue.")
    )
  ) {
    currentSong = selectSongOrBlank();
    songTitleInput.value = currentSong.song.title || '';
    loadSongToPartition(currentSong.song);
    loadSongToSequencer(currentSong.song);
    loadSongToDisk(currentSong.song);
    deleteButton.style.display = currentSong.memoryId ? 'inline-block' : 'none';
  } else {
    songmenu.selectedIndex = currentSong.memoryId + 1 || 0;
  }
}

songmenu.addEventListener("change", e => changeSong(e));

const makeSynths = (count) => {
  const synths = [];
  for (let i = 0; i < count; i++) {
    let synth = new Tone.Sampler({
      urls: { A4: '49206__tombola__fisher-price22.wav' },
      // urls: { A4: '49223__tombola__fisher-price9.wav' },
      baseUrl: "./",
    }).toDestination();
    synths.push(synth);
  }
  return synths;
};
const synths = makeSynths(notes.length);

const makePartition = () => {
  const rows = [];
  for (const note of notes) {
    const row = [];
    for (let i = 0; i < colsinputval; i++) {
      row.push({
        note: note,
        isActive: false
      });
    }
    rows.push(row);
  }
  return rows;
};
let grid = makePartition();

const configLoop = () => {
  const repeat = (time) => {
    clearPlayCursor();
    document.getElementById('timer').textContent = Math.trunc(time) + 's';
    grid.forEach((row, index) => {
      let synth = synths[index];
      let note = row[beat];
      if (note.isActive) {
        synth.triggerAttackRelease(note.note, 1);
      }
      if ((beat > 0) && (beat < colsinputval)) {
        document.querySelector(`.track-${index}.note-${beat - 1}`).classList.toggle('note-is-playing');
      }
    });
    beat = (beat + 1) % colsinputval;
    document.getElementById('timer2').textContent = beat + 'b';
    document.getElementById('play_cursor_position').style.transform = `rotate(${((360 / colsinputval) * (beat - 1)) * -1}deg)`;
  };
  Tone.Transport.bpm.value = 240;
  Tone.Transport.scheduleRepeat(repeat, "8n");
};

const addOrRemoveNoteToSong = (song, row, col) => {
  if (song.notes[row].includes(col)) {
    song.notes[row] = song.notes[row].filter(note => note !== col);
  } else {
    song.notes[row].push(col);
  }
}

const toggleNoteInSequencer = (clickedRowIndex, clickedNoteIndex, isActive) => {
  document.querySelector(`.note.track-${clickedRowIndex}.note-${clickedNoteIndex}`).className = classNames(
    "note", "track-" + clickedRowIndex, "note-" + clickedNoteIndex, 
    { "note-is-active": !!isActive }, 
    { "note-not-active": !isActive }
  );
}

const handleNoteToggle = (clickedRowIndex, clickedNoteIndex, e) => {
  switch (e.button) {
    case 0:
      // Left button clicked
      const note = grid[clickedRowIndex][clickedNoteIndex];
      note.isActive = !note.isActive;
      toggleNoteInSequencer(clickedRowIndex, clickedNoteIndex, note.isActive);
      toggleNoteToDisk(clickedNoteIndex, clickedRowIndex, note.isActive);
      addOrRemoveNoteToSong(currentSong.song, clickedRowIndex, clickedNoteIndex);
      break;
    case 1:
      // Middle button clicked
      break;
    case 2:
      // Right button clicked
      synths[clickedRowIndex].triggerAttackRelease(grid[clickedRowIndex][clickedNoteIndex].note, 4);
      break;
    default:
      // Unknown button code: ${e.button}
  }
};

const makeSequencer = () => {
  grid.forEach((row, rowIndex) => {
    const seqRow = document.createElement("div");
    seqRow.id = `row${rowIndex}`;
    seqRow.className = "sequencer-row";
    row.forEach((note, noteIndex) => {
      const noteCell = document.createElement("div");
      noteCell.classList.add('note', 'track-' + rowIndex, 'note-' + noteIndex);
      noteCell.addEventListener('contextmenu', e => e.preventDefault());
      noteCell.addEventListener("mouseup", e => {
        handleNoteToggle(rowIndex, noteIndex, e);
      });
      noteCell.addEventListener('mouseover', e => {
        const degrees = (360 / colsinputval) * noteIndex;
        const seconds = (45 / colsinputval) * noteIndex;
        document.getElementById('position').textContent = `${noteslib[rowIndex]}. ${seconds}/45s (${degrees}/360°) [${rowIndex}, ${noteIndex}]`;
        // Disk Circle
        document.querySelector('#track' + (rowIndex + 1)).style.borderColor = "rgba(255, 0, 255, 0.5)";
        document.querySelector('#select_cursor_position').style.display = "block";
        document.querySelector('#select_cursor_position').style.transform = `rotate(${degrees * -1}deg)`;
      });
      noteCell.addEventListener('mouseleave', e => {
        document.getElementById('position').textContent = '';
        // Disk Circle
        document.querySelector('#track' + (rowIndex + 1)).style.borderColor = "rgb(255, 192, 203)";
        document.querySelector('#select_cursor_position').style.display = "none";
      });
      seqRow.appendChild(noteCell);
    });
    sequencer.appendChild(seqRow);
  });
};

const pausePlay = () => {
  Tone.Transport.stop();
  playing = false;
}

const togglePlay = () => {
  console.log(grid);
  if (!started) {
    Tone.start();
    Tone.getDestination().volume.rampTo(-10, 0.001)
    configLoop();
    started = true;
  }
  if (playing) {
    pausePlay();
  } else {
    clearPlayCursor();
    Tone.Transport.start();
    playing = true;
    document.getElementById('play_cursor_position').style.display = "block";
  }
}

const configPlayButton = () => {
  const button = document.getElementById("play-button");
  const stop = document.getElementById("restart-button");
  const back = document.getElementById("back-button");
  const forward = document.getElementById("forward-button");
  button.addEventListener("click", e => togglePlay(e));
  stop.addEventListener('click', e => {
    pausePlay(e)
    beat = 0;
    clearPlayCursor();
    document.getElementById('play_cursor_position').style.display = 'none';
    document.getElementById('play_cursor_position').style.transform = 'rotate(0deg)';
});
};

const changeNotesCSSStyle = (value) => {
  const notes = document.querySelectorAll('.note');
  Array.from(notes).forEach(div => div.style.width = value + 'px');
  sequencer.style.width = (value * colsinputval) + 'px';
  document.getElementById('ruler').style.width = (value * colsinputval) + 'px';
}

const updateBeatwitdhInput = (value) => {
  beatwidth_number.value = value;
  changeNotesCSSStyle(value);
}

const updateBeatwitdhRange = (value) => {
  if (value < 1) {
    value = 1;
    beatwidth_number.value = value;
  }
  beatwidth_range.value = value;
  changeNotesCSSStyle(value);
}

const updateBeatwidthInputAndRange = (value) => {
  updateBeatwitdhInput(value);
  updateBeatwitdhRange(value);
}

const angleFromCoords = (x, y, centerX = 0, centerY = 0) => {
  const dX = x - centerX;
  const dY = y - centerY;
  const θ_radians = Math.atan2(dY, dX);
  let θ_degrees = θ_radians * (180 / Math.PI);
  if (θ_degrees < 0) {
    θ_degrees = θ_degrees + 360;
  }
  return θ_degrees;
}

beatwidth_range.addEventListener('mousedown', e => leftButtonPressed = true);
beatwidth_range.addEventListener('mouseup', e => leftButtonPressed = false);
beatwidth_range.addEventListener('mousemove', e => {
  if (leftButtonPressed) {
    updateBeatwitdhInput(e.currentTarget.value)
  }
});
beatwidth_number.addEventListener('change', e => updateBeatwitdhRange(e.currentTarget.value));
beatwidth_fill.addEventListener('click', e => updateBeatwidthInputAndRange(document.body.clientWidth / (colsinputval + 1)));
beatwidth_reset.addEventListener('click', e => updateBeatwidthInputAndRange(beatwidth_default));
disk_label_logo_input.addEventListener('change', e => {
  const value = e.currentTarget.value;
  disk_label_logo.textContent = value;
  currentSong.song.label.logo = value;
});
disk_label_number_input.addEventListener('change', e => {
  const value = e.currentTarget.value;
  disk_label_number.textContent = value;
  currentSong.song.label.number = value;
});
disk_label_text_top_input.addEventListener('change', e => {
  const value = e.currentTarget.value;
  disk_label_text_top.textContent = value;
  currentSong.song.label.text_top = value;
});
disk_label_text_bottom_input.addEventListener('change', e => {
  const value = e.currentTarget.value;
  disk_label_text_bottom.textContent = value;
  currentSong.song.label.text_bottom = value;
});
disk_outside_wall.addEventListener('mousemove', e => {
  const rect = e.currentTarget.getBoundingClientRect(),
        x0 = 242,
        y0 = 242,
        x = (e.clientX - rect.left).toFixed(1),
        y = (rect.bottom - e.clientY).toFixed(1),
        a = x - x0,
        b = y - y0,
        d = x0 - Math.sqrt(a * a + b * b).toFixed(0),
        degrees = angleFromCoords(x, y, x0, y0).toFixed(0),
        track = ((22 / 130) * (d - 10)).toFixed(0);
  document.getElementById('position').innerHTML = `x ${x} px, y ${y} px, θ ${degrees}°, d ${d} px, t ${track}`;
  document.querySelector('#select_cursor_position').style.display = "block";
  document.querySelector('#select_cursor_position').style.transform = `rotate(${degrees * -1}deg)`;
  Array.from(document.querySelectorAll('[id^="track"]')).forEach(track => {
    track.style.borderColor = "rgb(255, 192, 203)";
  });
  Array.from(document.querySelectorAll('[id^="row"]')).forEach(row => {
    row.classList.remove('highlight');
  })
  if (track >= 1 && track <= 22) {
    document.querySelector('#track' + track).style.borderColor = "rgba(255, 0, 255, 0.5)";
    document.querySelector(`#row${track - 1}`).classList.add('highlight');
  }
});
disk_outside_wall.addEventListener('mouseleave', e => {
  document.getElementById('position').textContent = '';
  document.querySelector('#select_cursor_position').style.display = "none";
});
disk_outside_wall.addEventListener('mouseup', e => {
  const rect = e.currentTarget.getBoundingClientRect(),
        x0 = 242,
        y0 = 242,
        x = (e.clientX - rect.left).toFixed(1),
        y = (rect.bottom - e.clientY).toFixed(1),
        a = x - x0,
        b = y - y0,
        d = x0 - Math.sqrt(a * a + b * b).toFixed(0),
        degrees = angleFromCoords(x, y, x0, y0).toFixed(0),
        track = ((22 / 130) * (d - 10)).toFixed(0);
  if (track >= 1 && track <= 22) {
    handleNoteToggle(track - 1, degrees, e);
  }
});
disk_outside_wall.addEventListener('contextmenu', e => e.preventDefault());

const saveOverlayParams = () => {
  const params = {
    'overlay_left': overlay_left.value,
    'overlay_top': overlay_top.value,
    'overlay_width': overlay_width.value,
    'overlay_height': overlay_height.value,
    'overlay_background': overlay_background.value,
    'overlay_opacity': overlay_opacity.value,
  };
  localStorage.setItem('fprecords_overlay', JSON.stringify(params));
}

const setOverlayParams = () => {
  if (localStorage.getItem('fprecords_overlay') && Object.keys(JSON.parse(localStorage.getItem('fprecords_overlay'))).length > 0) {
    const params = JSON.parse(localStorage.getItem('fprecords_overlay'));
    overlay.style.left = params.overlay_left + 'px';
    overlay_left.value = params.overlay_left;
    overlay.style.top = params.overlay_top + 'px';
    overlay_top.value = params.overlay_top;
    overlay.style.width = params.overlay_width + 'px';
    overlay_width.value = params.overlay_width;
    overlay.style.height = params.overlay_height + 'px';
    overlay_height.value = params.overlay_height;
    overlay.style.backgroundImage = `url(${params.overlay_background})`;
    overlay_background.value = params.overlay_background;
    overlay.style.opacity = params.overlay_opacity;
    overlay_opacity.value = params.overlay_opacity;
    overlay.style.transform = `rotate(${params.overlay_rotation}deg)`;
    overlay_rotation.value = params.overlay_rotation;
  }
}

overlay_left.addEventListener('change', e => {
  overlay.style.left = e.currentTarget.value + 'px';
  saveOverlayParams();
});
overlay_top.addEventListener('change', e => {
  overlay.style.top = e.currentTarget.value + 'px';
  saveOverlayParams();
});
overlay_width.addEventListener('change', e => {
  overlay.style.width = e.currentTarget.value + 'px';
  saveOverlayParams();
});
overlay_height.addEventListener('change', e => {
  overlay.style.height = e.currentTarget.value + 'px';
  saveOverlayParams();
});
overlay_background.addEventListener('change', e => {
  overlay.style.backgroundImage = `url(${e.currentTarget.value})`;
  saveOverlayParams();
});
overlay_opacity.addEventListener('mousemove', e => {
  overlay.style.opacity = e.currentTarget.value;
  saveOverlayParams();
});
overlay_rotation.addEventListener('change', e => {
  console.log(e.currentTarget.value);
  overlay.style.transform = `rotate(${e.currentTarget.value}deg)`;
  saveOverlayParams();
});
show_overlay.addEventListener('change', e => {
  setOverlayParams();
  overlay.style.display = (overlay.style.display == 'none') ? 'block' : 'none';
});

const make = () => {
  configPlayButton();
	makeSequencer();
  loadSongsFromMemory();
  makeSongsMenu();
  updateBeatwidthInputAndRange(document.body.clientWidth / (colsinputval + 1));
  // makeDisk2walls();
}

window.addEventListener("DOMContentLoaded", () => {
  make();
});
