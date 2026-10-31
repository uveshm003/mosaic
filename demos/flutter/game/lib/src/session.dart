import 'dart:math';

/// The rules of one round, kept apart from Flame so they can be tested directly.
class Session {
  static const startLives = 3;
  static const orbEvery = 15;
  static const freezeSeconds = 3.0;

  var score = 0;
  var lives = startLives;
  var best = 0;
  var freezeLeft = 0.0;
  var _nextOrbAt = orbEvery;

  bool get over => lives <= 0;
  bool get frozen => freezeLeft > 0;

  /// How fast bugs crawl, in logical pixels per second: faster as you score.
  double get speed => min(70 + score * 4.0, 300);

  /// Seconds between new bugs: shorter as you score.
  double get spawnInterval => max(0.35, 1.2 - score * 0.02);

  void reset() {
    score = 0;
    lives = startLives;
    freezeLeft = 0;
    _nextOrbAt = orbEvery;
  }

  /// A bug was squashed. Returns true when it earned a hot-reload orb.
  bool squash() {
    score++;
    best = max(best, score);
    if (score >= _nextOrbAt) {
      _nextOrbAt += orbEvery;
      return true;
    }
    return false;
  }

  /// A bug reached the build.
  void escape() {
    if (!over) lives--;
  }

  void collectOrb() => freezeLeft = freezeSeconds;

  void tick(double dt) => freezeLeft = max(0, freezeLeft - dt);
}
