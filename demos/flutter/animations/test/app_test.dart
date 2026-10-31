import 'package:animation_lab/main.dart';
import 'package:animation_lab/pages/curves_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  setUp(() {
    final binding = TestWidgetsFlutterBinding.ensureInitialized();
    binding.platformDispatcher.views.first
      ..physicalSize = const Size(1200, 900)
      ..devicePixelRatio = 1;
  });

  testWidgets('curves: picking a curve updates the code', (tester) async {
    await tester.pumpWidget(const AnimationLab());
    await tester.tap(find.widgetWithText(ChoiceChip, 'bounceOut'));
    await tester.pump();
    expect(find.textContaining('Curves.bounceOut'), findsOneWidget);
  });

  testWidgets('every named curve starts at 0 and ends at 1', (tester) async {
    for (final curve in namedCurves.values) {
      expect(curve.transform(0), closeTo(0, 1e-9));
      expect(curve.transform(1), closeTo(1, 1e-9));
    }
  });

  testWidgets('implicit: the counter and code follow the controls', (
    tester,
  ) async {
    await tester.pumpWidget(const AnimationLab());
    await tester.tap(find.text('Implicit'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Count'));
    await tester.tap(find.widgetWithText(FilterChip, 'big'));
    await tester.pumpAndSettle();
    expect(find.text('1'), findsOneWidget);
    expect(find.textContaining('width: 160'), findsOneWidget);
  });

  testWidgets('transitions: a tile opens its detail and goes back', (
    tester,
  ) async {
    await tester.pumpWidget(const AnimationLab());
    await tester.tap(find.text('Transitions'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Fade'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Routes'));
    await tester.pumpAndSettle();
    expect(find.text('Today’s planned stops.'), findsOneWidget);
    await tester.tap(find.text('Back'));
    await tester.pumpAndSettle();
    expect(find.text('Today’s planned stops.'), findsNothing);
  });

  testWidgets('stagger: every row ends fully visible', (tester) async {
    await tester.pumpWidget(const AnimationLab());
    await tester.tap(find.text('Stagger'));
    await tester.pumpAndSettle();
    final opacities = tester.widgetList<Opacity>(find.byType(Opacity));
    expect(opacities, isNotEmpty);
    expect(opacities.every((o) => o.opacity == 1), isTrue);
  });
}
