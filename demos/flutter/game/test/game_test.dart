import 'dart:math';

import 'package:flame/components.dart';
import 'package:flame_test/flame_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:hot_reload_game/main.dart';
import 'package:hot_reload_game/src/components.dart';
import 'package:hot_reload_game/src/game.dart';

HotReloadGame newGame() => HotReloadGame(random: Random(1));

void main() {
  testWithGame<HotReloadGame>('bugs spawn while playing', newGame, (
    game,
  ) async {
    game.start();
    game.update(2);
    await game.ready();
    expect(game.children.whereType<Bug>(), isNotEmpty);
  });

  testWithGame<HotReloadGame>('tapping a bug squashes it', newGame, (
    game,
  ) async {
    game.start();
    final bug = game.spawnBug()..position = Vector2(100, 100);
    await game.ready();
    game.squash(bug);
    await game.ready();
    expect(game.session.score, 1);
    expect(game.children.whereType<Bug>(), isEmpty);
  });

  testWithGame<HotReloadGame>(
    'a bug reaching the build costs a life',
    newGame,
    (game) async {
      game.start();
      final bug = game.spawnBug()..position = Vector2(100, game.buildLine - 1);
      await game.ready();
      game.update(0.5);
      await game.ready();
      expect(game.session.lives, 2);
      expect(bug.isMounted, isFalse);
    },
  );

  testWithGame<HotReloadGame>('frozen bugs stay put', newGame, (game) async {
    game.start();
    final bug = game.spawnBug()..position = Vector2(100, 100);
    await game.ready();
    game.session.collectOrb();
    game.update(1);
    expect(bug.position.y, 100);
  });

  testWidgets('play from the menu, lose every life, then play again', (
    tester,
  ) async {
    final game = newGame();
    await tester.pumpWidget(HotReloadApp(game: game));
    await tester.pump();
    expect(find.text('Play'), findsOneWidget);

    await tester.tap(find.text('Play'));
    await tester.pump();
    expect(game.playing, isTrue);
    expect(find.text('Play'), findsNothing);

    for (var i = 0; i < 3; i++) {
      final bug = game.spawnBug();
      await tester.pump();
      game.escaped(bug);
    }
    await tester.pump();
    expect(game.playing, isFalse);
    expect(find.text('Build failed'), findsOneWidget);

    await tester.tap(find.text('Play again'));
    await tester.pump();
    expect(game.playing, isTrue);
    expect(game.session.lives, 3);
  });

  testWidgets('a tap on a bug squashes it through Flame hit-testing', (
    tester,
  ) async {
    final game = newGame();
    await tester.pumpWidget(HotReloadApp(game: game));
    await tester.pump();
    await tester.tap(find.text('Play'));
    await tester.pump();
    final bug = game.spawnBug()..position = Vector2(120, 140);
    await tester.pump();
    await tester.tapAt(const Offset(120, 140));
    // Let the recognizer's long-press timer run out.
    await tester.pump(const Duration(seconds: 1));
    expect(game.session.score, 1);
    expect(bug.isRemoving || !bug.isMounted, isTrue);
  });
}
