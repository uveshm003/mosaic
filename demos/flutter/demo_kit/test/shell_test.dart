import 'package:demo_kit/demo_kit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

Widget app() => MaterialApp(
  theme: demoTheme(),
  home: DemoShell(
    title: 'Demo',
    pages: [
      DemoPage(
        label: 'One',
        icon: Icons.looks_one,
        builder: (_) => const Text('page one'),
      ),
      DemoPage(
        label: 'Two',
        icon: Icons.looks_two,
        builder: (_) => const Text('page two'),
      ),
    ],
  ),
);

void main() {
  testWidgets('switches pages from the bottom bar on a phone', (tester) async {
    tester.view.physicalSize = const Size(400, 800);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(app());
    expect(find.byType(NavigationBar), findsOneWidget);
    await tester.tap(find.text('Two'));
    await tester.pumpAndSettle();
    expect(find.text('page two'), findsOneWidget);
  });

  testWidgets('uses a rail on wide screens', (tester) async {
    tester.view.physicalSize = const Size(1200, 800);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(app());
    expect(find.byType(NavigationRail), findsOneWidget);
    expect(find.byType(NavigationBar), findsNothing);
  });
}
