import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:state_visualiser/main.dart';
import 'package:state_visualiser/src/activity.dart';
import 'package:state_visualiser/src/visualiser_page.dart';

void main() {
  setUp(rowBuilds.clear);

  Future<Activity> start(WidgetTester tester) async {
    tester.view.physicalSize = const Size(1400, 1000);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    final activity = Activity();
    await tester.pumpWidget(StateVisualiser(activity: activity));
    return activity;
  }

  testWidgets('adding to the cart updates the total and the graph', (
    tester,
  ) async {
    final activity = await start(tester);
    await tester.tap(find.byTooltip('Add Canvas tote'));
    await tester.pumpAndSettle();
    expect(find.text('€18.00'), findsWidgets);
    expect(
      activity.updates.keys,
      containsAll(['cart', 'subtotal', 'total', 'totalLabel']),
    );
    expect(find.textContaining('cart: {} → {tote: 1}'), findsOneWidget);
  });

  testWidgets('with select, only the changed row rebuilds', (tester) async {
    await start(tester);
    await tester.tap(find.byTooltip('Add Enamel mug'));
    await tester.pumpAndSettle();
    expect(find.textContaining('€12.00 · built ×2'), findsOneWidget);
    expect(find.textContaining('€4.00 · built ×1'), findsOneWidget);

    await tester.tap(find.text('Rows use select'));
    await tester.pumpAndSettle();
    await tester.tap(find.byTooltip('Add Enamel mug'));
    await tester.pumpAndSettle();
    // Without select every row rebuilds on any cart change.
    expect(find.textContaining('€4.00 · built ×2'), findsOneWidget);
  });

  testWidgets('the code page shows the providers', (tester) async {
    await start(tester);
    await tester.tap(find.text('Code'));
    await tester.pumpAndSettle();
    expect(find.textContaining('cartProvider.select'), findsOneWidget);
  });
}
