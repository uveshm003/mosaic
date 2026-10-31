import 'package:demo_kit/demo_kit.dart';
import 'package:flame/game.dart';
import 'package:flutter/material.dart';

import 'src/game.dart';
import 'src/session.dart';

void main() => runApp(HotReloadApp(game: HotReloadGame()));

class HotReloadApp extends StatelessWidget {
  const HotReloadApp({super.key, required this.game});

  final HotReloadGame game;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Hot reload',
      debugShowCheckedModeBanner: false,
      theme: demoTheme(),
      home: Scaffold(
        body: GameWidget(
          game: game,
          initialActiveOverlays: const ['start'],
          // The menus are ordinary Flutter widgets drawn over the Flame canvas.
          overlayBuilderMap: {
            'start': (context, HotReloadGame game) => _Panel(
              title: 'Hot reload',
              body:
                  'Bugs are crawling toward your build. Tap them to squash '
                  'them. Every ${Session.orbEvery} squashed drops a hot-reload '
                  'orb: tap it to freeze the bugs for a moment.',
              action: 'Play',
              onAction: game.start,
            ),
            'over': (context, HotReloadGame game) => _Panel(
              title: 'Build failed',
              body:
                  'You squashed ${game.session.score} bugs. '
                  'Best this visit: ${game.session.best}.',
              action: 'Play again',
              onAction: game.start,
            ),
          },
        ),
      ),
    );
  }
}

class _Panel extends StatelessWidget {
  const _Panel({
    required this.title,
    required this.body,
    required this.action,
    required this.onAction,
  });

  final String title;
  final String body;
  final String action;
  final VoidCallback onAction;

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    return ColoredBox(
      color: DemoColors.background.withValues(alpha: 0.7),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 380),
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(28),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(title, style: text.headlineMedium),
                    const SizedBox(height: 12),
                    Text(
                      body,
                      textAlign: TextAlign.center,
                      style: text.bodyLarge?.copyWith(color: DemoColors.muted),
                    ),
                    const SizedBox(height: 24),
                    FilledButton(
                      autofocus: true,
                      onPressed: onAction,
                      child: Text(action),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
