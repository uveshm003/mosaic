import 'dart:math';

import 'package:demo_kit/demo_kit.dart';
import 'package:flame/components.dart';
import 'package:flame/game.dart';
import 'package:flutter/material.dart';

import 'components.dart';
import 'session.dart';

/// Bugs crawl toward the build; tap to squash them before they land.
class HotReloadGame extends FlameGame {
  HotReloadGame({Random? random}) : random = random ?? Random();

  final Random random;
  final session = Session();
  var playing = false;
  var _sinceSpawn = 0.0;

  late final TextComponent _score;
  late final TextComponent _status;

  static const _hudHeight = 56.0;

  /// The y the bugs must not cross.
  double get buildLine => size.y - _hudHeight;

  static TextPaint _text(double size, Color color) => TextPaint(
    style: TextStyle(
      fontFamily: 'packages/demo_kit/Inter',
      fontSize: size,
      fontWeight: FontWeight.w600,
      color: color,
    ),
  );

  @override
  Color backgroundColor() => DemoColors.background;

  @override
  Future<void> onLoad() async {
    add(Board());
    _score = TextComponent(textRenderer: _text(18, Colors.white));
    _status = TextComponent(
      textRenderer: _text(13, DemoColors.mint),
      anchor: Anchor.topCenter,
    );
    addAll([_score, _status]);
  }

  @override
  void onMount() {
    super.onMount();
    // A few idle bugs behind the start menu; start() clears them.
    for (var i = 0; i < 7; i++) {
      spawnBug().position = Vector2(
        24 + random.nextDouble() * (size.x - 48),
        40 + random.nextDouble() * (buildLine - 120),
      );
    }
  }

  @override
  void onGameResize(Vector2 size) {
    super.onGameResize(size);
    if (!isLoaded) return;
    final y = size.y - _hudHeight + 16;
    _score.position = Vector2(16, y);
    _status.position = Vector2(size.x / 2, y + 3);
  }

  void start() {
    removeAll(children.whereType<Bug>());
    removeAll(children.whereType<Orb>());
    session.reset();
    _sinceSpawn = 0;
    playing = true;
    overlays
      ..remove('start')
      ..remove('over');
  }

  @override
  void update(double dt) {
    super.update(dt);
    if (isLoaded) {
      _score.text = 'Score ${session.score}';
      _status.text = session.frozen ? 'Hot reload: bugs frozen' : '';
    }
    if (!playing) return;
    session.tick(dt);
    if (session.frozen) return;
    _sinceSpawn += dt;
    if (_sinceSpawn >= session.spawnInterval) {
      _sinceSpawn = 0;
      spawnBug();
    }
  }

  Bug spawnBug() {
    final bug = Bug(
      position: Vector2(24 + random.nextDouble() * (size.x - 48), -24),
      phase: random.nextDouble() * pi * 2,
    );
    add(bug);
    return bug;
  }

  void squash(Bug bug) {
    if (!playing || bug.isRemoving) return;
    bug.removeFromParent();
    add(splat(bug.position.clone(), random));
    if (session.squash()) {
      add(
        Orb(position: Vector2(40 + random.nextDouble() * (size.x - 80), -24)),
      );
    }
  }

  void collectOrb(Orb orb) {
    if (!playing) return;
    orb.removeFromParent();
    session.collectOrb();
  }

  void escaped(Bug bug) {
    if (bug.isRemoving) return;
    bug.removeFromParent();
    if (!playing) return;
    session.escape();
    if (session.over) {
      playing = false;
      removeAll(children.whereType<Orb>());
      overlays.add('over');
    }
  }
}
